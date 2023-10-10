import os
import json
import glob
import pandas as pd
from tqdm import tqdm
import numpy as np
from .utils.index import Indexing

class Indexing:
    def __init__(self,root_data):
        self.root_data = root_data
        self.all_data_features = glob.glob(os.path.join(root_data,'**','clip-features-vit-b32', '*.npy')) 
        self.all_data_features += glob.glob(os.path.join(root_data,'**','clip-features-32', '*.npy'))
        self.all_map_keyframes = glob.glob(os.path.join(root_data,'**','map-keyframes', '*.csv'))
        self.all_data_images = glob.glob(os.path.join(root_data,'**','keyframes', '**', '*.jpg'))

    @property
    def get_all_features_from_files(self):
        features = np.empty([0,512],dtype = float)
        index = []
        for folder_keyframes in tqdm(self.all_data_features):
            # Add features vector
            feature_video = np.load(folder_keyframes)
            # feature_video /= np.linalg.norm(feature_video, axis=-1, keepdims=True)
            features = np.concatenate((features,feature_video),axis = 0)
            map_keyframes = folder_keyframes.replace('.npy','.csv').replace('clip-features-32','map-keyframes').replace('clip-features-vit-b32','map-keyframes')
            df = pd.read_csv(map_keyframes)
            id_video = list(df['frame_idx'])
            if folder_keyframes == '/mlcv/Databases/HCM_AIC23/data-batch-1/clip-features/L01_V001.npy':
                id_video[2] = 271
            video = folder_keyframes.split('/')[-1].replace('.npy', '')
            for id in id_video:
                index.append(str(video)+"_"+str(id))
        return features,np.array(index)
    
    # @property
    # def get_all_features(self):
    #     features = np.empty([0,512],dtype = float)
    #     index = []
    #     model_name = 'ViT-B/32'
    #     device = 'cuda' if torch.cuda.is_available() else 'cpu'
    #     model, preprocess = clip.load(model_name, device=device)
    #     for image in tqdm(self.all_data_images):
    #         video, frame = image.split('_')[-2].split('/')[-1], image.split('_')[-1]
            
    #         image_input = self.preprocess(image).unsqueeze(0).to(device)
    #         with torch.no_grad():
    #             image_features = model.encode_image(image_input)
    #         image_features /= image_features.norm(dim=-1, keepdim=True)
    #         features = np.concatenate((features,image_features.cpu().detach().numpy()),axis = 0)
    #         index.append(str(video)+"_"+str(id))
    #     return features, np.array(index)
    
def extractor():
    extractor = Indexing("/mlcv/Databases/HCM_AIC23")
    feature, index = extractor.get_all_features_from_files
    with open('./retriever/feature.npy','wb') as f:
        np.save(f,feature)
    with open('./retriever/index.npy','wb') as f:
        np.save(f,index)
    return feature, index
feature, index = extractor()

if not os.path.exists('./data'):
    os.makedirs('./data')

root_data = "/mlcv/Databases/HCM_AIC23"
all_keyframes = glob.glob(os.path.join(root_data,'**','keyframes', '**', '*.jpg'))
all_videos = glob.glob(os.path.join(root_data,'**','video', '*.mp4'))
all_map_keyframes = glob.glob(os.path.join(root_data,'**','map-keyframes', '*.csv'))
keyframe_json = []

for map_keyframes in tqdm(all_map_keyframes):
    video = map_keyframes.split('/')[-1].replace('.csv', '')
    
    df = pd.read_csv(map_keyframes)

    all_keyframes_in_this_video = glob.glob(os.path.join(root_data,'**','keyframes', video, '*.jpg'))
    for path in all_keyframes_in_this_video:
        keyframe_position= int(path.replace('.jpg','').split('/')[-1])
        keyframe_idx = list(df[df['n'] == keyframe_position]['frame_idx'])[0]
        
        if path == '/mlcv/Databases/HCM_AIC23/data-batch-1/keyframes/L01_V001/0003.jpg':
            keyframe_idx = 271
        keyframe_json.append({
            "path": path,
            "video": video,
            "keyframe":video + "_" + str(keyframe_idx),
            "keyframe_idx": int(keyframe_idx),
            "keyframe_position": int(keyframe_position)
        })
    
with open("./data/keyframe.json", "w") as outfile:
    json.dump(keyframe_json, outfile)