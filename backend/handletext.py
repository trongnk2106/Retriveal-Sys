import os
import json
import glob
import pandas as pd
from tqdm import tqdm
import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

all_keyframe_asr = []
all_keyframe_w_video = []
# keyframe_asr_files = glob.glob('./data/asr/**.txt')
# for file in tqdm(keyframe_asr_files[:10240]):
#     with open(file, 'r') as f:
#         all_keyframe_asr.append(f.read())
#         keyframe = file.split('/')[-1][:-4]
#         all_keyframe_w_video.append(keyframe)

# Mean Pooling - Take attention mask into account for correct averaging
def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0] #First element of model_output contains all token embeddings
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)


# Load model from HuggingFace Hub
tokenizer = AutoTokenizer.from_pretrained('keepitreal/vietnamese-sbert')
model = AutoModel.from_pretrained('keepitreal/vietnamese-sbert')
model.to('cuda')

root_data = "/mlcv/Databases/HCM_AIC23"

all_map_keyframes = glob.glob(os.path.join(root_data,'**','map-keyframes', '*.csv'))
for map_keyframes in tqdm(all_map_keyframes):
    video = map_keyframes.split('/')[-1].replace('.csv', '')
    if os.path.exists(f'./data/ocr_feature/{video}.npy') and os.path.exists(f'./data/asr_feature/{video}.npy'):
        continue
    if video == 'L20_V010':
        continue
    
    df = pd.read_csv(map_keyframes)

    all_keyframes_in_this_video = glob.glob(os.path.join(root_data,'**','keyframes', video, '*.jpg'))
    batch_no = map_keyframes[len('/mlcv/Databases/HCM_AIC23/data-batch-')]
    all_keyframes_in_this_video.sort()
    
    asr_sentences = []
    ocr_sentences = []
    for path in all_keyframes_in_this_video:
        keyframe_position_str = path.replace('.jpg','').split('/')[-1]
        keyframe_position= int(keyframe_position_str)
        
        keyframe_idx = list(df[df['n'] == keyframe_position]['frame_idx'])[0]
        pts_time = list(df[df['n'] == keyframe_position]['pts_time'])[0]
        start_time = min(0, pts_time -10)
        
        if path == '/mlcv/Databases/HCM_AIC23/data-batch-1/keyframes/L01_V001/0003.jpg':
            keyframe_idx = 271
        
        keyframe = video + '_' + str(keyframe_idx)
        asr_path = '/mlcv/WorkingSpace/Personals/nhanntt/AIC23/RetrievalSystem/backend/data/asr/' +  keyframe + '.txt'
        ocr_path = '/mlcv/WorkingSpace/Personals/nhanntt/OCR/OCR/Batch_' + batch_no + '/' + video + '/' + keyframe_position_str + '.txt' 
        with open(asr_path, 'r') as f:
            asr_sentences.append(f.read())
        with open(ocr_path, 'r') as f:
            ocr_sentences.append(f.read())

    # Tokenize sentences
    encoded_input = tokenizer(asr_sentences, padding=True, truncation=True, return_tensors='pt')
    encoded_input = encoded_input.to('cuda')
    # Compute token embeddings
    with torch.no_grad():
        model_output = model(**encoded_input)

    # Perform pooling. In this case, mean pooling.
    sentence_embeddings = mean_pooling(model_output, encoded_input['attention_mask'])

    sentence_embeddings = sentence_embeddings.cpu().detach().numpy()

    np.save(f'data/asr_feature/{video}.npy', sentence_embeddings)
    print(sentence_embeddings.shape) 

    # Tokenize sentences
    encoded_input = tokenizer(ocr_sentences, padding=True, truncation=True, return_tensors='pt')
    encoded_input = encoded_input.to('cuda')

    # Compute token embeddings
    with torch.no_grad():
        model_output = model(**encoded_input)

    # Perform pooling. In this case, mean pooling.
    sentence_embeddings = mean_pooling(model_output, encoded_input['attention_mask'])

    sentence_embeddings = sentence_embeddings.cpu().detach().numpy()
    np.save(f'data/ocr_feature/{video}.npy', sentence_embeddings)
    print(sentence_embeddings.shape)  
 