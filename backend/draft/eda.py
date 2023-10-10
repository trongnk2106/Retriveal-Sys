
import numpy as np
import json
import glob
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
feature = np.load("./data/feature.npy")
with open("./data/keyframe.json", "r") as outfile:
    keyframes = json.load(outfile)
with open("./data/merge_object.json", "r") as outfile:
    merge_object = json.load(outfile)
print(len(os.listdir('./data/asr')))
root_data = "/mlcv/Databases/HCM_AIC23"
print(len(merge_object))
all_keyframes = glob.glob(os.path.join(root_data,'**','keyframes', '**', '*.jpg'))
all_videos = glob.glob(os.path.join(root_data,'**','video', '*.mp4'))
all_map_keyframes = glob.glob(os.path.join(root_data,'**','map-keyframes', '*.csv'))
all_data_features = glob.glob(os.path.join(root_data,'**','clip-features', '*.npy'))
all_data_features += glob.glob(os.path.join(root_data,'**','clip-features-32', '*.npy'))
print(len(all_keyframes))
print(len(feature))
print(len(keyframes))
print(len(all_videos), len(all_map_keyframes), len(all_data_features))