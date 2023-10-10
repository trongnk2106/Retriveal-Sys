import numpy as np
from .utils.TIUday import Searcher, CLIPTextExtractor, CLIPImageExtractor

def load_model(clip_features, hist_features):
    CLIP_SEARCHER = Searcher(features=clip_features)
    HIST_SEARCHER = Searcher(features=hist_features,distance_measure = 'squared_l2')
    CLIP_TEXT = CLIPTextExtractor()
    CLIP_IMAGE = CLIPImageExtractor()
    MODELS = {
        "HIST-SEARCHER": HIST_SEARCHER,
        "CLIP-SEARCHER": CLIP_SEARCHER,
        "TEXT": CLIP_TEXT,
        "IMAGE": CLIP_IMAGE,
    }
    return MODELS

def handle_query(query, MODELS):
    text_embedding = MODELS["TEXT"](query)
    results = MODELS["CLIP-SEARCHER"](text_embedding.reshape(-1))
    return results

def find_nearest(image_features, MODELS):
    results = MODELS["CLIP-SEARCHER"](image_features.reshape(-1))
    return results

def find_hist_neareast(color, MODELS):
    results = MODELS["HIST-SEARCHER"](color.reshape(-1))
    return results

def filter_hist_nearest(color, hist_features, indices):
    indices = np.asarray(indices)
    hist_features = hist_features[indices]
    SearchModel = Searcher(features=hist_features,distance_measure = 'squared_l2')
    results = SearchModel(color.reshape(-1))
    return results

def find_nearest_by_path(path, left, top, right, bottom, MODELS):
    image_embedding = MODELS["IMAGE"](path, left, top, right, bottom)
    results = MODELS["CLIP-SEARCHER"](image_embedding.reshape(-1))
    return results