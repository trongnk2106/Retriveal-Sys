import os
import pandas as pd
import json
import wget
import ffmpeg

df = pd.read_table('./data/all.tsv',  names=['url', 'text'], header=None)

keyframes = []
if not os.path.exists('./data/video'):
    os.makedirs('./data/video')

if not os.path.exists('./data/keyframe'):
    os.makedirs('./data/keyframe')

# In this problem, I just handle with 200 fist samples
for i in range(len(df[:200])):
    url = df['url'][i]
    wget.download(url, f'./data/video/{i}.gif')
    (
        ffmpeg
        .input(f'data/video/{i}.gif')
        .output(f'data/keyframe/{i}_%d.jpeg', vf="select='eq(pict_type,I)'", vsync=0)
        .run()
    )
        
    frames = os.listdir("./data/keyframe")
    frame_temp = []
    for frame in frames: 
        video, frame_id = frame.split("_")
        if video == str(i):
            frame_temp.append(frame_id)
    
    frame_temp.sort()
    for j, frame_id in enumerate(frame_temp):
        keyframes.append({
            "url": url,
            "video": str(i) + ".gif",
            "keyframe": str(i) +"_"+ frame_id,
            "frame_id": frame_id,
            "frame_position": j
        })
with open("./data/keyframe.json", "w") as outfile:
    json.dump(keyframes, outfile)