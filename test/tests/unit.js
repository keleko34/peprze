mocha.setup('bdd');

(function(describe,it,expect,spy){
  /* mocha tests */
  
  function xhr(url, cb)
  {
    var __xhr = new XMLHttpRequest();
    __xhr.open('GET', url, cb);
    
    __xhr.onreadystatechange = function()
    {
      if(__xhr.readyState === 4)
      {
          if(__xhr.status === 200)
          {
            cb(null, __xhr.responseText);
          }
          else
          {
            cb(new Error("File not found ERR:" + __xhr.status));
          }
      }
    }
    
    __xhr.send();
  }
  
  function getFile(url)
  {
    return new Promise(function(resolve, reject){
      xhr(url, function(err, file){
        if(err) return reject(err);
        return resolve(file);
      })
    });
  }
  
  describe("Promise:", function(){
    
    describe("Promise resolves:", function(){
      it('Should properly resolve a promise', function(done){
        getFile('/test/tests/files/a.js')
        .then(function(v){
          expect(v).to.equal('a');
          done();
        })
        .catch(function(){
          expect(false).to.equal(true);
          done();
        })
      });
      
      it('Should properly resolve multiple then statements', function(done){
        getFile('/test/tests/files/a.js')
        .then(function(){
          
          return 'test';
        })
        .then(function(v){
          expect(v).to.equal('test');
          done();
        })
        .catch(function(){
          expect(false).to.equal(true);
          done();
        })
      });
      
      it('Should properly resolve a returned promise', function(done){
        getFile('/test/tests/files/a.js')
        .then(function(){
          return getFile('/test/tests/files/b.js');
        })
        .then(function(v){
          expect(v).to.equal('b');
          done();
        })
        .catch(function(){
          expect(false).to.equal(true);
          done();
        })
      });
    });
    
    describe("Promise rejects:", function(){
      it('Should properly reject a promise', function(done){
        getFile('/test/tests/files/c.js')
        .then(function(v){
          expect(v).to.equal('c');
          done();
        })
        .catch(function(err){
          expect(err instanceof Error).to.equal(true);
          done();
        })
      });
      
      it('Should properly reject multiple catch statements', function(done){
        getFile('/test/tests/files/c.js')
        .then(function(v){
          expect(v).to.equal('c');
          done();
        })
        .catch(function(){
          return 'test';
        })
        .catch(function(err){
          expect(err).to.equal('test');
          done();
        })
      });
      
      it('Should properly reject a returned promise', function(done){
        getFile('/test/tests/files/a.js')
        .then(function(){
          return getFile('/test/tests/files/c.js');
        })
        .then(function(v){
          expect(v).to.equal('c');
          done();
        })
        .catch(function(err){
          expect(err instanceof Error).to.equal(true);
          done();
        })
      });
    });
  })
  
  
  mocha.run();
}(describe,it,chai.expect,sinon.spy));