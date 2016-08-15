angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    // Form data for the registration modal
    $scope.registration = {};
    // Form data for the reservation modal
    $scope.reservation = {};
    

    // LOGIN MODAL ---------------------------------
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);
        
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };

    // REGISTRATION MODAL ---------------------------------
    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
    
    // RESERVE MODAL ---------------------------------
    // Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.reserveform = modal;
    });   
    
    // Triggered in the reserve modal to close it
    $scope.closeReserve = function() {
        $scope.reserveform.hide();
    };

    // Open the reserve modal
    $scope.reserve = function() {
        $scope.reserveform.show();
    };   
    
    // Perform the reserver action when the user submits the reservation form
    $scope.doReserve = function() {
        console.log('Doing reservation', $scope.reservation);
    
        //Simulate a login delay. Remove later
        $timeout(function() {
            $scope.closeReserve();
        }, 1000);
    
    };

    // Check to make sure platform is ready
    $ionicPlatform.ready(function() {
        
        $scope.takePicture = function() {
            
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
                console.log('Base64 image URL:' + imageData);
            }, function(err) {
                console.log(err);
            });

            $scope.registerform.show();

        };
        
        $scope.openGallery = function() {
            var options = {
                maximumImagesCount: 1, // only need 1 image for profile
                width: 100,
                height: 100,
                quality: 80
            };
            $cordovaImagePicker.getPictures(options).then(function(results) {
                
                for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                    $scope.registration.imgSrc = results[i];
                }
                // call $scope.closeRegister() to close modal is unneccessary, but follows assignment video specs
                $scope.closeRegister();
            }, function(error) {
                console.log('Imagepicker error: ' + error);
            });
            
        };
    });
})

.controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
            
    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";
    
    $scope.dishes = dishes;


    $scope.select = function(setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        }
        else if (setTab === 3) {
            $scope.filtText = "mains";
        }
        else if (setTab === 4) {
            $scope.filtText = "dessert";
        }
        else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function() {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.addFavorite = function (index) {
        console.log("index is " + index);

        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();
        
        $ionicPlatform.ready(function (){
           
            $cordovaLocalNotification.schedule({
                id: 1,
                title: "Added Favorite",
                text: $scope.dishes[index].name
            }).then(function () {
                console.log('Added Favorite ' + $scope.dishes[index].name);
            },
            function () {
                console.log('Failed to add Favorite ');
            });
            
            $cordovaToast
                .show('Added Favorite ' + $scope.dishes[index].name, 'long', 'center')
                .then(function (success) {
                    // success
                }, function (error) {
                    // error
                });
            
        });
    }
}])

.controller('ContactController', ['$scope', function($scope) {

    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

    var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

    $scope.sendFeedback = function() {

        console.log($scope.feedback);

        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        }
        else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            $scope.feedback.mychannel="";
            $scope.feedbackForm.$setPristine();
            console.log($scope.feedback);
        }
    };
}])

.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function($scope, $stateParams, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.dish = {};
    $scope.showDish = false;
    $scope.message="Loading ...";

    $scope.dish = menuFactory.get({
        id: parseInt($stateParams.id, 10)
    })
    .$promise.then(
        function (response) {
            $scope.dish = response;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText
        }
    );

    $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });

    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
     // Execute action
    });

    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
    });
    
    $scope.addFavorite = function () {
        console.log("index is " + parseInt($stateParams.id,10));

        favoriteFactory.addToFavorites(parseInt($stateParams.id,10));
        $scope.closePopover();
        
        $ionicPlatform.ready(function (){
           
            $cordovaLocalNotification.schedule({
                id: 1,
                title: "Added Favorite",
                text: $scope.dish.name
            }).then(function () {
                console.log('Added Favorite ' + $scope.dish.name);
            },
            function () {
                console.log('Failed to add Favorite ');
            });
            
            $cordovaToast
                .show('Added Favorite ' + $scope.dish.name, 'long', 'bottom')
                .then(function (success) {
                    // success
                }, function (error) {
                    // error
                });
            
        });
    }
    
    // DISH-COMMENT MODAL ---------------------------------
    // Create the dish-comment modal
    $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.dishCommentform = modal;
    });   
    
    // Close the dish-comment modal
    $scope.closeComment = function() {
        $scope.dishCommentform.hide();
    };

    // Open the dish-comment modal
    $scope.comment = function() {
        $scope.closePopover();
        $scope.dishComment = {};
        $scope.dishCommentform.show();
    };   
    
    // User submits the comment
    $scope.doDishComment = function() {
        
        $scope.dishComment.date = new Date().toISOString();
        console.log('Adding dish comment', $scope.dishComment);
    
        $scope.dish.comments.push($scope.dishComment);
        menuFactory.update({id:$scope.dish.id},$scope.dish);

        $scope.closeComment();
    };

}])

.controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {

    $scope.mycomment = {rating:5, comment:"", author:"", date:""};

    $scope.submitComment = function () {

        $scope.mycomment.date = new Date().toISOString();
        console.log($scope.mycomment);

        $scope.dish.comments.push($scope.mycomment);
        menuFactory.update({id:$scope.dish.id},$scope.dish);

        $scope.commentForm.$setPristine();

        $scope.mycomment = {rating:5, comment:"", author:"", date:""};
    }
}])

// implement the IndexController and About Controller here
//  
.controller('IndexController', ['$scope', 'dish', 'promotion', 'leader','baseURL', function($scope, dish, promotion, leader, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = leader;
    $scope.showDish = false;
    $scope.message="Loading ...";
    $scope.dish = dish;
    $scope.promotion = promotion;

}])

.controller('AboutController', ['$scope', 'leaders','baseURL', function($scope, leaders, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leaders = leaders;
    console.log($scope.leaders);

}])

.controller('FavoritesController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaVibration', function($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $cordovaVibration) {
            
    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Loading...'
    });
    
    $scope.favorites = favoriteFactory.getFavorites();

    $scope.dishes = menuFactory.query(
        function (response) {
            $scope.dishes = response;
            $timeout(function () {
                $ionicLoading.hide();
            }, 1000);
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
            $timeout(function () {
                $ionicLoading.hide();
            }, 1000);
        }
    );

    console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function() {
        $scope.shouldShowDelete = !($scope.shouldShowDelete);
        console.log($scope.shouldShowDelete);
    }
            
    $scope.deleteFavorite = function(index) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
                // Vibrate for 500 ms to let user know deletion is successful
                $cordovaVibration.vibrate(500);
            } else {
                console.log('Canceled delete');         
            }
        });

        $scope.shouldShowDelete = false;
    }
                    
}])

.filter('favoriteFilter', function() {

    return function(dishes, favorites) {

        var out = [];

        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }

        return out;
    }})
;