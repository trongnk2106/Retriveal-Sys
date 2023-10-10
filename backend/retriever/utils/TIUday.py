import pandas as pd 
import numpy as np 
import os
from os import listdir
from os.path import isfile,join
import json
import glob
import scann
import torch
from tqdm import tqdm
from PIL import Image
import pandas as pd
import clip
# from transformers import AutoTokenizer, AutoModel

class Searcher:
    def __init__(self, features, num_neighbors = 250, distance_measure = 'dot_product'):
        # squared_l2, dot_product
        self.searcher = scann.scann_ops_pybind.builder(
                                features,
                                num_neighbors,
                                distance_measure).score_brute_force(1).build()
        
    def __call__(self,text_embedding):
        neighbors, distances = self.searcher.search(text_embedding, final_num_neighbors = 250)
        return neighbors
    
class CLIPTextExtractor:
    def __init__(self):
        model_name = 'ViT-B/32'
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model, self.preprocess = clip.load(model_name, self.device)
        
    def __call__(self, text):
        print(text)
        text_input = clip.tokenize([text]).to(self.device)
        with torch.no_grad():
            text_features = self.model.encode_text(text_input)[0]
        text_features /= text_features.norm(dim=-1, keepdim=True)
        return text_features.cpu().detach().numpy()

class CLIPImageExtractor:
    def __init__(self):
        model_name = 'ViT-B/32'
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model, self.preprocess = clip.load(model_name, device=self.device)

    def __call__(self, path, left, top, right, bottom):
        image = Image.open(path)
        bbox = (left, top, right, bottom)
        cropped_image = image.crop(bbox)
        image_input = self.preprocess(cropped_image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            image_features = self.model.encode_image(image_input)
        image_features /= image_features.norm(dim=-1, keepdim=True)
        return image_features.cpu().detach().numpy()
    
def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0] #First element of model_output contains all token embeddings
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

# class OCRASRTextExtractor:
#     def __init__(self):
#         model_name = 'keepitreal/vietnamese-sbert'
#         self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
#         self.tokenizer = AutoTokenizer.from_pretrained(model_name)
#         self.model = AutoModel.from_pretrained(model_name)
#         self.model.to(self.device)

        
#     def __call__(self, text):
#         print(text)
#         encoded_input = self.tokenizer([text], padding=True, truncation=True, return_tensors='pt')
#         encoded_input = encoded_input.to(self.device)
#         with torch.no_grad():
#             model_output = self.model(**encoded_input)

#         sentence_embeddings = mean_pooling(model_output, encoded_input['attention_mask'])
#         sentence_embeddings /= sentence_embeddings.norm(dim=-1, keepdim=True)
#         sentence_embeddings = sentence_embeddings.cpu().detach().numpy()
#         return sentence_embeddings
    
    
        