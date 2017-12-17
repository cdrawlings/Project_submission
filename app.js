'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);


// define our app and dependencies (remember to include firebase!)
var app = angular.module("App", ["firebase", "ngRoute", 'ui.sortable', "xeditable", "ngCookies", "Home", "Authentication"]);


app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/template/public/intro.html',
        controller: 'projectCtrl'
    })
        .when('/Home', {
            templateUrl: '/template/public/intro.html',
            controller: 'projectCtrl'
        })
        .when('/Graphics_form', {
            templateUrl: '/template/public/f_graphics.html',
            controller: 'projectCtrl'
        })
        .when('/PowerPoint_form', {
            templateUrl: '/template/public/f_power.html',
            controller: 'projectCtrl'
        })
        .when('/Event_form', {
            templateUrl: '/template/public/f_event.html',
            controller: 'projectCtrl'
        })
        .when('/Naming_form', {
            templateUrl: '/template/public/f_naming.html',
            controller: 'projectCtrl'
        })
        .when('/Graphics_queue', {
            templateUrl: '/template/public/q_graphic.html',
            controller: 'projectCtrl'
        })
        .when('/PowerPoint_queue', {
            templateUrl: '/template/public/q_power.html',
            controller: 'projectCtrl'
        })
        .when('/Event_queue', {
            templateUrl: '/template/public/q_event.html',
            controller: 'projectCtrl'
        })
        .when('/Naming_queue', {
            templateUrl: '/template/public/q_naming.html',
            controller: 'projectCtrl'
        })
        .when('/Graphics_admin', {
            templateUrl: '/template/admin/a_graphic.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/PowerPoint_admin', {
            templateUrl: '/template/admin/a_power.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Event_admin', {
            templateUrl: '/template/admin/a_event.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Naming_admin', {
            templateUrl: '/template/admin/a_naming.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Graphics_archived', {
            templateUrl: '/template/admin/arc_graphic.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/PowerPoint_archived', {
            templateUrl: '/template/admin/arc_power.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Event_archived', {
            templateUrl: '/template/admin/arc_event.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Naming_archived', {
            templateUrl: '/template/admin/arc_naming.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Submit', {
            templateUrl: '/template/public/submit.html',
            controller: 'projectCtrl'
        })
        .when('/Admin', {
            templateUrl: '/template/admin/admin.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Archive', {
            templateUrl: '/template/admin/archived.html',
            controller: 'projectCtrl',
            secure: true
        })
        .when('/Queue', {
            templateUrl: '/template/public/queue.html',
            controller: 'projectCtrl'
        })
        .when('/Login', {
            templateUrl: '/template/authentication/login.html',
            controller: 'LoginController'
        })

        .when('/Thankyou_naming', {
            templateUrl: '/template/public/t_naming.html',
            controller: 'projectCtrl'
        })
        .when('/Thankyou_events', {
            templateUrl: '/template/public/t_events.html',
            controller: 'projectCtrl'
        })
        .when('/Thankyou_graphics', {
            templateUrl: '/template/public/t_graphics.html',
            controller: 'projectCtrl'
        })
        .when('/Thankyou_power', {
            templateUrl: '/template/public/t_power.html',
            controller: 'projectCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

//Active Nav bar
app.directive('bsActiveLink', ['$location', function ($location) {
    return {
        restrict: 'A', //use as attribute
        replace: false,
        link: function (scope, elem) {
            //after the route has changed
            scope.$on("$routeChangeSuccess", function () {
                var hrefs = ['/#' + $location.path(),
                    '#' + $location.path(), //html5: false
                    $location.path()]; //html5: true
                angular.forEach(elem.find('a'), function (a) {
                    a = angular.element(a);
                    if (-1 !== hrefs.indexOf(a.attr('href'))) {
                        a.parent().addClass('active');
                    } else {
                        a.parent().removeClass('active');
                    }

                });
            });
        }
    }
}]);

app.run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});


//authorization
app.run(['$rootScope', '$location', '$cookieStore', '$http', '$route',
    function ($rootScope, $location, $cookieStore, $http, $route) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if trying to access
            // a secure page and not logged in
            var nextRoute = $route.routes[$location.path()];
            if (nextRoute.secure && !$rootScope.globals.currentUser) {
                $location.path('/Login');
            }


        });
    }]);


// this factory returns a synchronized array Graphic design projects
app.factory("jobProjects", ["$firebaseArray", "$firebaseStorage",
    function ($firebaseArray, $firebaseStorage) {
        // create a reference to the database location where we will store our data
        var ref = firebase.database().ref("Graphics");

        // this uses AngularFire to create the synchronized array

        return $firebaseArray(ref);

    }


]);


// this factory returns a synchronized array PowerPoint Project
app.factory("jobPower", ["$firebaseArray",
    function ($firebaseArray) {
        // create a reference to the database location where we will store our data
        var ref = firebase.database().ref("powerPoint");

        // this uses AngularFire to create the synchronized array
        return $firebaseArray(ref);
    }
]);


// this factory returns a synchronized array for Event projects
app.factory("jobNaming", ["$firebaseArray",
    function ($firebaseArray) {
        // create a reference to the database location where we will store our data
        var ref = firebase.database().ref("Naming");

        // this uses AngularFire to create the synchronized array
        return $firebaseArray(ref);
    }
]);


// this factory returns a synchronized array for Event projects
app.factory("jobEvents", ["$firebaseArray",
    function ($firebaseArray) {
        // create a reference to the database location where we will store our data
        var ref = firebase.database().ref("Events");

        // this uses AngularFire to create the synchronized array
        return $firebaseArray(ref);
    }
]);


app.controller("projectCtrl", ["$scope", "jobProjects", "jobPower", "jobEvents", "jobNaming", "$rootScope", "$location",
    // we pass our new jobProjects factory into the controller
    function ($scope, jobProjects, jobPower, jobEvents, jobNaming, $route, $rootScope, $location) {

        // we add jobProjects array to the scope to be used in our ng-repeat
        $scope.todos = jobProjects;
        $scope.power = jobPower;
        $scope.events = jobEvents;
        $scope.naming = jobNaming;


        $scope.addProject = function () {


            var storage = firebase.storage();
            var storageRef = storage.ref("job");
            var filesRef = storageRef.child('files');


            var filesSelected = document.getElementById("nameImg").files;
            if (filesSelected.length > 0) {
                var file = filesSelected[0];


                console.log("Let's upload a file!");
                console.log(file);

                var task = storageRef.child(file.name).put(file);

                //

                task.on('state_changed', function (snapshot) {

                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED:
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING:
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    // unsuccessful uploads
                }, function () {
                    //successful uploads on complete

                    var downloadURL = task.snapshot.downloadURL;
                    console.log(downloadURL);

                    $scope.save(downloadURL);


                });


            }
            ;
        };

        // a method to create new todos; called by ng-submit
        // calling $add on a synchronized array is like Array.push(),
        // except that it saves the changes to our database!

        $scope.save = function (downloadURL) {
            $scope.todos.$add({
                job: $scope.newJob,
                client: $scope.newClient,
                brief: $scope.newBrief,
                due_date: $scope.newDate,
                toggle: false,
                optionMenu: false,
                taskCount: 0,
                doneCount: 0,
                priority: -1,
                status: 'pending',
                comment: 'Add comment',
                completed: false,
                attachment: downloadURL
            });
        };

             //save updated date
        $scope.saveEdit = function (data, item, field) {

            item[field] = data;

            $scope.todos.$save(item);
            console.log(data, item);
        };

        $scope.startTodo = function (id, todo) {

            // CHECK THAT ITEM IS VALID
            if (todo.$id === undefined) return;

            // UPDATE STATUS TO IN PROGRESS AND SAVE
            todo.status = 'working';
            $scope.todos.$save(todo);
            console.log(todo);
            console.log(status);
        };



        // MARK TODO AS COMPLETE METHOD
        $scope.completeTodo = function (index, todo) {

            // CHECK THAT ITEM IS VALID
            if (todo.id === undefined) return;

            console.log(id);
            console.log(todo);


            // UPDATE STATUS TO COMPLETE AND SAVE
            todo.status = 'archived';
            $scope.todos.$save(todo);

            console.log(todo);

        };

        // REMOVE TODO ITEM METHOD
        $scope.removeTodo = function (todo) {

            // CHECK THAT ITEM IS VALID
            if (todo.$id === undefined) return;

            // FIREBASE: REMOVE ITEM FROM LIST
            $scope.todos.$remove(todo);
        };







            // reset the todo input
            $scope.todo = "";



        // a method to create new todos; called by ng-submit
        $scope.addPower = function () {
            // calling $add on a synchronized array is like Array.push(),
            // except that it saves the changes to our database!
            $scope.power.$add({
                job: $scope.newJob,
                client: $scope.newClient,
                brief: $scope.newBrief,
                due_date: $scope.newDate,
                attachments: $scope.newAttachments,
                toggle: false,
                optionMenu: false,
                taskCount: 0,
                doneCount: 0,
                priority: -1,
                completed: false,
                status: 'pending',
                comment: 'Add comment'
            });

            // reset the todo input
            $scope.powerp = "";
        };


        // a method to create new todos; called by ng-submit
        $scope.addEvent = function () {
            // calling $add on a synchronized array is like Array.push(),
            $scope.events.$add({
                job: $scope.newJob,
                client: $scope.newClient,
                brief: $scope.newBrief,
                due_date: $scope.newDate,
                attachments: $scope.newAttachments,
                toggle: false,
                optionMenu: false,
                taskCount: 0,
                doneCount: 0,
                priority: -1,
                completed: false
            });

            // reset the todo input
            $scope.event = "";
        };// except that it saves the changes to our database!


        // a method to create new todos; called by ng-submit
        $scope.addNaming = function () {
            // calling $add on a synchronized array is like Array.push(),
            $scope.naming.$add({
                due_date: $scope.newDate,
                client: $scope.newClient,
                division: $scope.newDept,
                approval: $scope.newApproval,
                job: $scope.newProject,
                overview: $scope.newOver,
                replace: $scope.newReplace,
                core: $scope.newCore,
                access: $scope.newAccess,
                url: $scope.newURL,
                audience: $scope.newGroup,
                region: $scope.newRegion,
                features: $scope.newFeatures,
                benefits: $scope.newBenefits,
                party: $scope.newParty,
                label: $scope.newLabel,
                contract: $scope.newContract,
                support: $scope.newSupport,
                exclusive: $scope.newExclusive,
                sell: $scope.newSell,
                delivery: $scope.newDelivery,
                stage: $scope.newStage,
                schedule: $scope.newSchedule,
                phase: $scope.newPhase,
                added_features: $scope.newAddFeat,
                life_span: $scope.newLifeSpan,
                competitors: $scope.newCompetitors,
                advantage: $scope.newAdvan,
                important: $scope.newImportant,
                avoid: $scope.newAvoid,
                suggest: $scope.newSuggest,
                document: $scope.newDocument,
                sales: $scope.newSalesContact,
                product: $scope.newProductContact,
                toggle: false,
                optionMenu: false,
                taskCount: 0,
                doneCount: 0,
                priority: -1,
                completed: false
            });

            // reset the todo input
            $scope.namingn = "";
        };// except that it saves the changes to our database!


// Tracks the number of active Graphics jobs
        $scope.$watch('todos', function () {
            var total = 0;
            var remaining = 0;
            $scope.todos.forEach(function (todo) {
                total++;
                if (todo.completed === false) {
                    remaining++;
                }
            });
            $scope.totalCount = total;
            $scope.remainingCount = remaining;
            $scope.allChecked = remaining === 0;
        }, true);


// Tracks the number of active PowerPoint jobs
        $scope.$watch('power', function () {
            var total = 0;
            var remaining = 0;
            $scope.power.forEach(function (powerI) {
                total++;
                if (powerI.completed === false) {
                    remaining++;
                }
            });
            $scope.totalCount = total;
            $scope.remainingPower = remaining;
            $scope.allChecked = remaining === 0;
        }, true);


// Tracks the number of active Naming jobs
        $scope.$watch('events', function () {
            var total = 0;
            var remaining = 0;
            $scope.events.forEach(function (eventI) {
                total++;
                if (eventI.completed === false) {
                    remaining++;
                }
            });
            $scope.totalCount = total;
            $scope.remainingEvents = remaining;
            $scope.allChecked = remaining === 0;
        }, true);


// Tracks the number of active Naming jobs
        $scope.$watch('naming', function () {
            var total = 0;
            var remaining = 0;
            $scope.naming.forEach(function (namingI) {
                total++;
                if (namingI.completed === false) {
                    remaining++;
                }
            });
            $scope.totalCount = total;
            $scope.remainingNaming = remaining;
            $scope.allChecked = remaining === 0;
        }, true);


        //Sortable

        $scope.sortableOptions = {
            stop: function (event, ui) {
                $scope.todos.forEach(function (todo) {
                    todo.priority = $scope.todos.indexOf(todo);
                    $scope.todos.$save(todo);
                });
            }
        }




    }
]);
