# Interactive Retrieval System

## Introduction
An information retrieval system is built to provide users with the most relevant information in a timely and efficient manner and it consists of many stages: data collection, data preprocessing, indexing, data retrieving, ranking, and presentation. In this report, we use a machine learning-based information retrieval system designed for video event retrieval. The system uses the combination of CNNs, ViT, and CLIP in feature extraction, and the ScaNN method in ranking proved effective in providing accurate and efficient search results.

## Enviroment
Ubuntu 18.04.6 

## Instruction

### Step 1 - Data collecting
Open CLI, run
```
cd backend
python3 datacollecting.py
```


### Step 2 - Installing package and running web system
Excute
```
pip install -r requirements.txt
uvicorn main:app
```
Open new CLI (still open the remaining CLI), excute
```
cd frontend
npm install
npm start
```
Web system displays on port 4000

## Usage
Retrieve Video by Vietnamese description or English description. Detail can be used to view all extracted keyframes with the video.  KNN to find the keyframes with the closest distance to the selected keyframe.
