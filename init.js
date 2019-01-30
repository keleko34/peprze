window.Promise = (function(){
  
  function Promise(res, resolvers, rejecters)
  {
    this.__value = [void 0];
    this.__resolve = (resolvers ? resolvers : []);
    this.__reject = (rejecters ? rejecters : []);
    this.__fulfilled = false;
    this.__rejected = false;
    this.__finished = false;
    this.__base = undefined;
    
    this.resolve = (function()
    {
      var __value,
          __resolver = this.__resolve.splice(0,1)[0];

      this.__fulfilled = true;
      if(arguments[0]) this.__value[0] = arguments[0];

      if(__resolver)
      {
        try{
          __value = __resolver.apply((this.base || this), this.__value);
        }
        catch(e)
        {
          this.reject(e);
          return console.error("Rejection Error in Promise on", e.stacktrace);
        }

        if(__value instanceof Promise)
        {
          __value.__resolve = __value.__resolve.concat(this.__resolve);
          __value.__reject = __value.__reject.concat(this.__reject);
          __value.__value = __value.__value.concat(this.__value);
          if(__value.__fulfilled || __value.__finished)
          {
            __value.resolve.apply((__value.base || __value), __value.__value);
          }
        }
        else
        {
          this.resolve(__value);
        }
      }
      else
      {
        if(!this.__rejected) this.__finished = true;
      }
    }).bind(this);
    
    this.reject = (function()
    {
      var __value,
          __rejecter = this.__reject.splice(0,1)[0];

      this.__fulfilled = true;
      this.__rejected = true;
      if(arguments[0]) this.__value[0] = arguments[0];

      if(__rejecter)
      {
        try{
          __value = __rejecter.apply((this.base || this), this.__value);
        }
        catch(e)
        {
          this.reject(e);
          return console.error("Rejection Error in Promise on", e.stacktrace);
        }
        this.reject(__value);
      }
      else
      {
        this.__finished = true;
      }
    }).bind(this);
    
    try{
      this.__control = res(this.resolve, this.reject);
    }
    catch(e)
    {
      this.reject(e);
      console.error("Rejection Error in Promise on", e.stacktrace);
    }
  }

  Promise.prototype.then = function(v)
  {
    this.__resolve.push(v);
    if(this.__fulfilled && this.__finished && !this.__rejected) this.resolve();
    return this;
  }

  Promise.prototype.catch = function(v)
  {
    this.__reject.push(v);
    if(this.__fulfilled && this.__finished && this.__rejected) this.reject();
    return this;
  }
  
  return Promise;
}())