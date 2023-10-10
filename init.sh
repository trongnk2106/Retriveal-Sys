#!/bin/bash
sleep 100
log_file="/mlcv/WorkingSpace/Personals/nhanntt/AIC23/RetrievalSystem/backend/uploaddata.log"

curl -X PUT "http://192.168.20.164:9200/test" -H "Content-Type: application/json" -d '{
    "mappings": {
        "properties": {
            "path": {"type": "text"},
            "youtube_id": {"type": "text"},
            "pts_time": {"type": "float"},
            "video": {"type": "text"},
            "keyframe": {"type": "text"},
            "keyframe_idx": {"type": "integer"},
            "keyframe_position": {"type": "integer"},
            "OCR": {"type": "text"},
            "ASR": {"type": "text"}
        }
    }
}'


# Set the batch size
batch_size=6000

for i in $(seq 0 6000 324001)
do
  # Index the current batch
  batch_file="/mlcv/WorkingSpace/Personals/nhanntt/AIC23/RetrievalSystem/backend/data/keyframe_split/bulk_keyframe_batch_${i}.json"
  
  curl_output=$(curl -X POST "http://192.168.20.164:9200/test/_bulk" -H "Content-Type: application/json" --data-binary "@$batch_file")

  # Log the result
  echo "Result of indexing batch $i:" >> "$log_file"
  echo "$curl_output" >> "$log_file"
done

echo "Finished." >> "$log_file"
