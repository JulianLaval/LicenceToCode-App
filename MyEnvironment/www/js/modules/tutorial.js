var tutorial = {
    
    _containerDiv: $('#tutorial-layer'),
    _containerDivInner: $('#tutorial-layer-inner'),
    _tutorialImg: $('#image img'),
    _tutorialDescription: $('#tutorial-description div'),
    _tutorialButton: $('#tutorial-button span'),
    _tutorialState: $('#tutorial-state'),

    _currentPage: 0,
    _offsetStart: 0,

    _descriptions: [
        "Welcome to MyEnvironment! Click/swipe to get started",
        "Explore a variety of environmental datasets",
        "Slide to compare datasets side by side",
        "Search and favourite locations that are important to you",
        "Overlay datasets to reveal hidden connections"
    ],
    
    _buttonText: [
        "Let's go!",
        "Got it!",
        "Cool!",
        "Awesome!",
        "Let's get started!"
    ],
    
    init: function() {
    
        // if done, don't show
        if(localStorage['tutorial'] == "done") return;
        
        var _this = this;
        
        this.showTutorial();  
        this.switchTutorial();
        
        // listeners
        this._tutorialButton.on('click', function(){ _this.nextPage(); });
        
        this._containerDiv.on('mousedown touchstart', function(e){
        
            // standardise touch      
            _this._offsetStart = (e.type == "touchstart") ? e.originalEvent.touches[0].pageX : e.pageX;
            
        });
        
        // slider off drag handler
        this._containerDiv.on('mouseup touchend', function(e){
      
            var endOffset = (e.type == "touchend") ? e.originalEvent.changedTouches[0].pageX : e.pageX;
            var offsetDiff = endOffset - _this._offsetStart;
            
            // ignore if less than 50% of width
            if(Math.abs(offsetDiff / $(window).width()) < 0.5) return;
            
            // check direction
            (offsetDiff < 0) ? _this.nextPage() : _this.prevPage();
        });
    },
    
    switchTutorial: function(){
    
        var _this = this;
        var currentPage = this.getCurrentPage();
        
        this._containerDivInner.fadeOut(400, function(){
            _this._tutorialImg.attr('src', 'img/tutorial/tutorial-' + currentPage + '.png');
            _this._tutorialDescription.text(_this._descriptions[currentPage]);
            _this._tutorialButton.text(_this._buttonText[currentPage]);
            _this.updateDots();
            
            _this._containerDivInner.fadeIn();
        });
    },
    
    updateDots: function(){
        var currentPage = this.getCurrentPage();
        $.each(this._tutorialState.children('li'), function(key, val){
            (key == currentPage) ? $(val).attr('class', 'tutorial-state-full') : $(val).attr('class', 'tutorial-state-empty');
        });
    },

    showTutorial: function(){
        this._containerDiv.show();
    },
    
    hideTutorial: function() {
        localStorage['tutorial'] = "done";
        this._containerDiv.fadeOut(1000);
    },
    
    getCurrentPage: function(){
        return this._currentPage;
    },
    
    setCurrentPage: function(newPage){
        this._currentPage = newPage;
    },
    
    nextPage: function(){       
        var currentPage = this.getCurrentPage();
        if(currentPage < 4){
            this.setCurrentPage(currentPage + 1);
            this.switchTutorial();
        }
        else this.hideTutorial();
    },
    
    prevPage: function(){
        var currentPage = this.getCurrentPage();
        if(currentPage == 0) return;
        this.setCurrentPage(currentPage - 1);
        this.switchTutorial();
    }
}