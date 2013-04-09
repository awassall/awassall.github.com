function Retailer(){
	var retail = new Object();
	retail.pos = NULL;
	retail.price = {"Hour": 0, "Distance": 0, "Object": 0};
	retail.radius = 0;
	retail.typeOvehicle = 0;
	retail.latest =0;
	retail.avail = new Array();
	retail.addNew = function(begin, end){
		var newOne = new Object;
		newOne.begin = begin;
		newOne.end = end;
		this.avail[this.latest] = newOne;
		this.latest++;
	}
	return retail;
	
}

