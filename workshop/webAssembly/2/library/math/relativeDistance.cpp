extern "C"{
  double relativeDistance(double realLength, double start, double end, double d, bool allowOverflow);
}

double relativeDistance(double realLength, double start, double end, double d, bool allowOverflow){
	double mux = (d - start)/(end - start);
	if(!allowOverflow){ if(mux > 1){return realLength;}else if(mux < 0){return 0;} }
	return mux*realLength;
}
