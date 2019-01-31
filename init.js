window.Promise = (function(){
  
  function setDescriptor(value, writable, enumerable, redefinable)
  {
    return {
      value: value,
      writable: !!writable,
      enumerable: !!enumerable,
      configurable: !!redefinable
    }
  }
  
  function Promise(control)
  {
    this.value = void 0;
    this.fulfilled = false;
    this.control = control;
    
    Object.defineProperties(this, {
      __value: setDescriptor([this.value], true),
      __resolve: setDescriptor([], true),
      __reject: setDescriptor([], true),
      __rejected: setDescriptor(false, true),
      __awaiting: setDescriptor(true, true),
      __fulfilled: setDescriptor(false, true),
      __aborted: setDescriptor(false, true),
      __base: setDescriptor(undefined, true),
      __control: setDescriptor(control)
    });
    
    setTimeout((function(){
      this.__control.call(this, this.resolve.bind(this), this.reject.bind(this));
    }).bind(this), 0);
  }
  
  function execute(type, value)
  {
    this.__awaiting = false;
    
    if(value !== undefined) this.__value[0] = this.value = value;
    
    if(type) this.__rejected = true;
    
    var __value,
        __method = this[(!type ? '__resolve' : '__reject')].splice(0,1)[0];
    
    if(__method)
    {
      __value = __method.apply((this.__base || this), this.__value);
      
      if(__value instanceof Promise)
      {
        var __resolves = this.__resolve,
            __rejects = this.__reject,
            __values = this.__value;
        
        /* garbage collect */
        this.__fulfilled = this.fulfilled = true;
        this.__value = this.value = null;
        this.__resolve = null;
        this.__reject = null;
        this.__base = null;
        this.__aborted = true;
        
        __value.__resolve = __value.__resolve.concat(__resolves);
        __value.__reject = __value.__reject.concat(__rejects);
        __value.__value = __value.__value.concat(__values);
        
        if(__value.fulfilled && !__value.__aborted) __value[__value.rejected ? 'reject' : 'resolve'].call(__value);
      }
      else
      {
        this[(!type ? 'resolve' : 'reject')].call(this, __value);
      }
    }
    else
    {
      this.__fulfilled = this.fulfilled = true;
    }
  }
  
  function resolve(v)
  {
    return execute.call(this, 0, v);
  }
  
  function reject(v)
  {
    return execute.call(this, 1, v);
  }
  
  function then(func)
  {
    this.__resolve.push(func);
    if(this.__fulfilled && !this.__aborted && !this.__rejected) this.resolve();
    return this;
  }
  
  function error(func)
  {
    this.__reject.push(func);
    if(this.__fulfilled && !this.__aborted && this.__rejected) this.resolve();
    return this;
  }
  
  Object.defineProperties(Promise.prototype, {
    resolve: setDescriptor(resolve),
    reject: setDescriptor(reject),
    then: setDescriptor(then, false, true),
    catch: setDescriptor(error, false, true)
  })
  
  return Promise;
}())