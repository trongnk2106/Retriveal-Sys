import os
import json
import glob
import pandas as pd
from tqdm import tqdm
import numpy as np
from PIL import Image

root_data = "/mlcv/Databases/HCM_AIC23"
all_map_keyframes = glob.glob(os.path.join(root_data,'**','map-keyframes', '*.csv'))
keyframe_json = []

def mean_color_vector(image_path):
    image = Image.open(image_path)
    color_vector = np.array(image).mean(axis=(0, 1))  # Calculate the mean color value
    return color_vector


for map_keyframes in tqdm(all_map_keyframes[::-1]):
    video = map_keyframes.split('/')[-1].replace('.csv', '')
    
    df = pd.read_csv(map_keyframes)

    all_keyframes_in_this_video = glob.glob(os.path.join(root_data,'**','keyframes', video, '*.jpg'))
    all_keyframes_in_this_video.sort()
    if video == 'L20_V010':
        continue

    for path in all_keyframes_in_this_video:
        
        keyframe_position= int(path.replace('.jpg','').split('/')[-1])
        
        keyframe_idx = list(df[df['n'] == keyframe_position]['frame_idx'])[0]

        keyframe = video + "_" + str(keyframe_idx)

        if os.path.exists(f'./data/color_vector/{keyframe}.npy'):
            continue
        
        mean_hist_feature = mean_color_vector(path)

        with open(f'./data/color_vector/{keyframe}.npy','wb') as f:
            np.save(f, mean_hist_feature)
