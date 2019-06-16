extern "C"{
  float* arrayDoubler(float array[], float length);
}

float* arrayDoubler(float array[], float length){
  for(int a = 0; a < length; a++){
    array[a] = array[a]*2;
  }
	return array;
}
