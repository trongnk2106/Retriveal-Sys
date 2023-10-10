# Use an official Python runtime as the base image
ARG PYTORCH="1.10.0"
ARG CUDA="11.3"
ARG CUDNN="8"

FROM pytorch/pytorch:${PYTORCH}-cuda${CUDA}-cudnn${CUDNN}-devel

ENV TORCH_CUDA_ARCH_LIST="6.0 6.1 7.0+PTX"
ENV TORCH_NVCC_FLAGS="-Xfatbin -compress-all"
ENV CMAKE_PREFIX_PATH="$(dirname $(which conda))/../"

# Set the working directory in the container
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./
# Install CUDA and CuDNN (for GPU support)
# Modify this section based on your specific GPU setup

# Install CUDA
RUN apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/3bf863cc.pub
RUN apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64/7fa2af80.pub

# Install CuDNN
RUN apt-get update && apt-get install -y git zip ffmpeg libsm6 libxext6 git ninja-build libglib2.0-0 libsm6 libxrender-dev libxext6 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY backend/main.py ./main.py
COPY backend/retriever ./retriever

# Expose port 8081 for the backend
EXPOSE 8081

# Start FastAPI using uvicorn with GPU support
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081", "--reload"]
