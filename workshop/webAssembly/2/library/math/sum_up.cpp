extern "C"{
  float sum_up(float vals[], int size);
}

float sum_up(float vals[], int size) {
 	float res = 0;
	for(int i=0; i<size; i++){
		res += vals[i];
	}
	return res;
}
