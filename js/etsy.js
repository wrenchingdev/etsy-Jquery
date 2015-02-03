;
(function() {

    //===================================================================================
    //--------------------Two screens, one for item search, one for item detail
    //===================================================================================

    function EtsyClient(key) {
        this.key = key;
        this.users = [];
        this.listingData = [];

        var self = this;

        var EtsyRouter = Backbone.Router.extend({
            routes: {
                ":user_id": "drawUserInfo"
            },
            drawUserInfo: function(user_id) {
                self.drawUser(user_id)
            },
            initialize: function() {
                Backbone.history.start();
            }
        })
        var router = new EtsyRouter();

        this.draw();
    }

    EtsyClient.prototype = {
        URLs: {
            listings: "https://openapi.etsy.com/v2/listings/active"
        },
        access_key: function() {
            return "?api_key=" + this.key
        },
        getData: function() {
            //Pull listing data from etsy
            return $.getJSON("https://openapi.etsy.com/v2/listings/active.js?api_key=hvo4ybhgni81tihncd8wlhv0&callback=?")
                // return $.getJSON(this.URLs.listings + ".js" + this.access_key + "&callback=?")
                .then(function(data) {
                    return data;
                })
        },
        loadTemplate: function(name) {
            //load template file for page
            // debugger;
            return $.get("./templates/" + name + ".html").then(function(data) {
                console.log(data);
                return data;
            })
        },
        draw: function() {
            //template and user data loaded, draw page
            $.when(
                this.getData(),
                this.loadTemplate("listingsTemplate")
            ).then(function(listings, html) {
                console.log(listings);
                var listingPage = document.querySelector(".wrapper");
                var listingsId = _.template(html);
                console.log(listingsId)
                listingPage.innerHTML = listingsId({
                     listings: listings //TH- the data we want is in listings.results,,,,but remember,
                    ///also, that listings.results is an array
                });





                //TH-so here we go: each item in listing.results had a data object with properties: title, price, etc
                // therefore, we have to loop over listing.results and create HTML for each one

                // (1) we create an empty string where we will add our compiled templates
                var allCompiledTemplates = "";

                // (2) we iniitate the loop over the listings.results array that was returned from our etsy query
                listings.results.forEach(function(someListing, index) {

                    //Remember: We tell the forEach loop to do something for each item in the array
                    // in this case, since listings.results is an array of objects
                    // someListing is each object

                    //(3) We are going to compile **one instance** of our html template
                    var compiledTemplate = _.template(html, someListing)

                    //Note1: with _.template(a,b) you it's easer to pass all at once:
                    //a) the template-text
                    //b) the data

                    //Note2:   _.template([text],[data]) will return  a string: you've seen this in the console b4

                    //(4)...So here we're just concatenating those strings together
                    allCompiledTemplates += compiledTemplate
                })

                //(5) and here we insert the html-text-string into the DOM
                document.querySelector('wherever-it-goes').innerHTML = allCompiledTemplates

            })
        }
    }
    window.EtsyClient = EtsyClient;
})();
