from fastapi import FastAPI, HTTPException, Query
# from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.cors import CORSMiddleware as CORSMiddleware
import json
from fastapi.staticfiles import StaticFiles
from retriever import load_model, handle_query, find_hist_neareast, filter_hist_nearest, find_nearest_by_path
import os 
import numpy as np
import pandas as pd
from googletrans import Translator
from pydantic import BaseModel
from elasticsearch import Elasticsearch
from tqdm import tqdm
from retrying import retry  # You may need to install the 'retrying' library
import elasticsearch
from elasticsearch.helpers import bulk

# Create an Elasticsearch client instance
es = Elasticsearch([{'host': '192.168.20.164', 'port': 9200}])

class VideoData(BaseModel):
    description: str   
    type: str

class ObjectSearch(BaseModel):
    obj : list
    listv: list
    
class Color(BaseModel):
    color : str
    listfilter : list

class LogMessage(BaseModel):
    message: str

# App object
app = FastAPI()

app.mount("/data", StaticFiles(directory="data"))
app.mount("/mlcv/Databases/HCM_AIC23/data-batch-1/keyframes/", StaticFiles(directory="/mlcv/Databases/HCM_AIC23/data-batch-1/keyframes/"))
app.mount("/mlcv/Databases/HCM_AIC23/data-batch-2/keyframes/", StaticFiles(directory="/mlcv/Databases/HCM_AIC23/data-batch-2/keyframes/"))
app.mount("/mlcv/Databases/HCM_AIC23/data-batch-3/keyframes/", StaticFiles(directory="/mlcv/Databases/HCM_AIC23/data-batch-3/keyframes/"))

# origins = ["http://192.168.20.164:8080"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

translator = Translator()

with open('./data/keyframe.json') as file:
    video_list = json.load(file)
    
clip_feature = np.load("./data/clip-feature.npy")
hist_feature = np.load("./data/hist-feature.npy")

with open('./data/merge_3batch.json', 'r', encoding='utf-8') as obj:
    object_list = json.load(obj)

MODELS = load_model(clip_feature, hist_feature)

def find_dicts_with_keyframe(data_list, keyframes_id):
    return [data_list[keyframe_id] for keyframe_id in keyframes_id]

def find_detail(data_list, keyframe):
    video = '_'.join(keyframe.split('_')[:-1])
    matching_dicts = []
    for data_dict in data_list:
        if video == data_dict['video']:
            matching_dicts.append(data_dict)
        if keyframe == data_dict['keyframe']:
            keyframe_position = data_dict['keyframe_position']

    matching_dict_limits = []
    for data_dict in matching_dicts:
        if keyframe_position - 12 <= data_dict['keyframe_position'] <=keyframe_position +12:
            matching_dict_limits.append(data_dict)

    matching_dict_limits.sort(key=lambda x: x['keyframe_position'])
    return matching_dict_limits


@app.get("/api/video")
async def get_video():
    response = video_list
    return response

@app.post("/api/video/")
async def post_todo(VideoData: VideoData):
    if VideoData.type == 'Vietnamese': 
        English = translator.translate(VideoData.description , src='vi', dest='en').text
        results_id = handle_query(English, MODELS)
        keyframe_ans = find_dicts_with_keyframe(video_list, results_id)

        return keyframe_ans
    if VideoData.type == 'English': 
        results_id = handle_query(VideoData.description, MODELS)
        keyframe_ans = find_dicts_with_keyframe(video_list, results_id)
        return keyframe_ans
    if VideoData.type == 'ASR':
        results = es.search(index='test', body={
            "size": 250,
            "query": {
                "match": {
                    "ASR": VideoData.description
                }
            }
        })
        return [hit['_source'] for hit in results['hits']['hits']]
    if VideoData.type == 'OCR':
        results = es.search(index='test', body={
            "size": 250,
            "query": {
                "match": {
                    "OCR": VideoData.description
                }
            }
        })
        return [hit['_source'] for hit in results['hits']['hits']]

@app.get("/api/video/detail/{keyframe}")
async def search_video_by_keyframe(keyframe):
    response = find_detail(video_list, keyframe)
    return response

@app.post("/api/video/color/")
async def search_video_by_color(color: Color):
    
    listvideo = color.listfilter # list video da search bang cac phuong phap tren can filter
    color = color.color # mau pick tu color picker
    if len(listvideo) <= 1: # neu video tra ve bang rong (tuc la chua search bang pp khac, dung color de search)
        color = color.lstrip('#')
        lv = len(color)
        color = tuple(int(color[i:i + lv // 3], 16) for i in range(0, lv, lv // 3))

        color = np.asarray(color)
        results = find_hist_neareast(color, MODELS)
        video_ans = find_dicts_with_keyframe(video_list, results)
    else :
        indices = [video_list.index(item) for item in listvideo]
        color = color.lstrip('#')
        lv = len(color)
        color = tuple(int(color[i:i + lv // 3], 16) for i in range(0, lv, lv // 3))

        color = np.asarray(color)
        results = filter_hist_nearest(color, hist_feature, indices)
        video_ans = find_dicts_with_keyframe(video_list, results)
        
    return video_ans 


@app.get("/api/video/knn/{keyframe_with_location}")
async def find_nearest_video_by_keyframe(keyframe_with_location):
    # print('in KNN',keyframe_with_location)
    keyframe, left, top, right, bottom = keyframe_with_location.split('+')
    left, top, right, bottom = float(left), float(top), float(right), float(bottom)
    left, top, right, bottom = int(left), int(top), int(right), int(bottom)

    for i, indx_sample in enumerate(video_list):
        if indx_sample['keyframe'] == keyframe:
            keyframe_position = i
            path = indx_sample['path']
            break
        
    results = find_nearest_by_path(path, left, top, right, bottom, MODELS)
    video_ans = find_dicts_with_keyframe(video_list, results)
   
    return video_ans
 


@app.post("/api/object/")
async def objectsearch(objectData:ObjectSearch):
    checker = objectData.obj
    result_dict = []
    for ob in objectData.listv:
        path_json = ob['path'].replace('.jpg','.json').replace('keyframes','objects')
        videoid = ob['video']
        # if objec_list['video'][]
        objs_checker = object_list[videoid][path_json]
        for ck in checker:
            if ck in objs_checker:
                result_dict.append(ob)

    return result_dict



@app.post("/api/log")
async def receive_log_message(log_data: LogMessage):
    log_message = log_data.message

    with open("./logfile.log", "a") as log_file:
        log_file.write(log_message + "\n\n")

    print("Received log message:", log_message)

    return {"message": "Log message received and logged successfully"}