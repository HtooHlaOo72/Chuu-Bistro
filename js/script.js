$(function(){
    console.log("loaded..");
    $("#toggler_button").blur(function(event){
        var screen=window.innerWidth;
        if(screen<768){
            $("#navbarTogglerDemo03").collapse("hide");
        }
    })
});

(function(global){
    var dc={};
    var homeHtml="/snippets/home.html";
    var allcategoriesUrl="http://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml="snippets/categories-title-snippet.html";
    var categoryHtml="snippets/categories-snippet.html";
    var menuItemsUrl="http://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitle="snippets/menu-items-title.html";
    var menuItemsHtml="snippets/menu-items.html";

    console.log(homeHtml);
    var insertHtml=function(selector,html){
        var targetElem=document.querySelector(selector);
        
        targetElem.innerHTML=html;
        console.log("Inserted...");
    }
    var showLoading=function(selector){
        var html="<div class='container-fluid text-center' id='loading_gif'>";
        
        html+="<img src='images/ajax-loader.gif' class='img-fluid'></div>";
        insertHtml(selector,html);
        console.log("Loading showed...");

    }
    var insertProperty=function(string,propName,propValue){
        var propToReplace="{{"+propName+"}}";
        string=string.replace(new RegExp(propToReplace,"g"),propValue);
        return string;
    }
    document.addEventListener("DOMContentLoaded",
        function(event){
            console.log("Before show loading...");
            showLoading("#main-content");
            $ajaxUtils.sendGetRequest(homeHtml,function(responseText){
                document.querySelector("#main-content")
                .innerHTML=responseText;
            }
            ,false);

        }
    );

    dc.loadMenuCategories=function(){
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allcategoriesUrl,buildAndShowCategoriesHTML);


        
    }

    function buildAndShowCategoriesHTML(categories){
        $ajaxUtils.sendGetRequest(categoriesTitleHtml,
            function(categoriesTitleHtml){
                $ajaxUtils.sendGetRequest(categoryHtml,
                    function(categoryHtml){
                        var categoryViewHtml=buildCategoryViewHtml(categories,categoriesTitleHtml,categoryHtml);
                        insertHtml("#main-content",categoryViewHtml);
                    }
                    ,false);
            },
            false);
    };
    function buildCategoryViewHtml(categories,categoriesTitleHtml,categoryHtml){
        finalHtml=categoriesTitleHtml;
        finalHtml+="<section class='row'>";
        for(var i=0;i<categories.length;i++){
            var html=categoryHtml;
            var name=categories[i].name;
            var short_name=categories[i].short_name;
            console.log("short_name is "+short_name);
            html=insertProperty(html,"name",name);
            html=insertProperty(html,"short_name",short_name);
            finalHtml+=html;
        }
        finalHtml+="</section>"

        return finalHtml;
    };

    dc.loadMenuItems=function(categoryShort){
        console.log("loaded menu item : "+categoryShort);
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(menuItemsUrl+categoryShort,buildAndShowMenuItemsHtml);

    }

    function buildAndShowMenuItemsHtml(categoryMenuItems){

        $ajaxUtils.sendGetRequest(menuItemsTitle,
            function(menuItemsTitle){
                $ajaxUtils.sendGetRequest(menuItemsHtml,function(menuItemsHtml){
                    var menuItemsViewHtml=buildMenuItemsViewHtml(categoryMenuItems,menuItemsTitle,menuItemsHtml);
                    insertHtml("#main-content",menuItemsViewHtml);
                },
                false)
            },
            false
            );

    }

    function buildMenuItemsViewHtml(categoryMenuItems,menuItemsTitle,menuItemsHtml){
        menuItemsTitle=insertProperty(menuItemsTitle,"name",categoryMenuItems.category.name);
        menuItemsTitle=insertProperty(menuItemsTitle,"special_instructions",categoryMenuItems.category.special_instructions);

        var finalHtml=menuItemsTitle;
        finalHtml+="<section class='row'>";
        var menuItems=categoryMenuItems.menu_items;
        var catShortName=categoryMenuItems.category.short_name;
        console.log("Important : "+catShortName);
        for(var i=0;i<menuItems.length;i++){
            var html=menuItemsHtml;
            html=insertProperty(html,"short_name",menuItems[i].short_name);
            html=insertProperty(html,"cat_short_name",catShortName);
            html=insertItemPrice(html,"price_small",menuItems[i].price_small);
            html=insertItemPrice(html,"price_large",menuItems[i].price_large);
            html=insertItemPortion(html,"large_portion_name",menuItems[i].large_portion_name);
            html=insertItemPortion(html,"small_portion_name",menuItems[i].small_portion_name);
            html=insertProperty(html,"name",menuItems[i].name);
            html=insertProperty(html,"description",menuItems[i].description);

            console.log("in loop : "+i);
            if(i%2!=0){
                html+="<div class='clearfix visible-md-block visible-lg-block'></div>";
            }
            finalHtml+=html;
        }

        
        finalHtml+="</section>";
        console.log(finalHtml);
        return finalHtml;
    }

    function insertItemPrice(html,pricePropName,priceValue){
        if(!priceValue){
            return insertProperty(html,pricePropName,"");
        }
        priceValue="$"+priceValue.toFixed(2);
        return insertProperty(html,pricePropName,priceValue);
    }

    
    function insertItemPortion(html,
        portionPropName,
        portionValue) {
        // If not specified, return original string
        console.log("In insert portion");
        if (!portionValue) {
            return insertProperty(html, portionPropName, "");
        }
        console.log("In insert portion");
        portionValue = "(" + portionValue + ")";
        html = insertProperty(html, portionPropName, portionValue);
        return html;
    }

    global.$dc=dc;
})(window);