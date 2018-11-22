"use strict";

var app = angular.module("app", ["ui.router","oc.lazyLoad","ngAnimate","ngCookies"]);
app.config(function($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {
	$stateProvider
        .state("app",{
            abstract: true,
            templateUrl: './app/full.html',
            resolve: {
              loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                // you can lazy load controllers
                return $ocLazyLoad.load({
                  files: ['app/js/push.js']
                });
              }]
            }
            
        })
        .state("appSimple",{
            abstract: true,
            templateUrl: './app/simple.html'
        })
        
        .state("app.home", {
            url:"/home",
            templateUrl: "./app/home.html",
            controller: "HomeCtrl",
            controllerAs: 'vm'
            
        })
        .state("app.tables", {
            url:"/tables",
            templateUrl: "./app/html-table.html",
            controller: "TableCtrl",
            controllerAs: 'vm'
        })
        .state("app.typo", {
            url:"/typo",
            templateUrl: "./app/typography.html",
            controller: "TableCtrl",
            controllerAs: 'vm'
        })
        .state("appSimple.login", {
            url:"/login",
            templateUrl: "./app/login.html",
            controller: "LoginCtrl",
            controllerAs: 'vm'
        }).state("appSimple.register", {
            url:"/register",
            templateUrl: "./app/register.html",
            controller: "RegisterCtrl",
            controllerAs: 'vm'
        });
        $urlRouterProvider.otherwise('/home');
});
app.controller('NotificationCtrl',function($scope,$timeout,$location){
    var serverkey = 'AAAAfmWCvpA:APA91bHu9gbWqvMuQwcWWkxxAzp-SmyGCa_lgs0xGGn478XIv1qDAEQIbNiuRZ39GM5zE4w9tr-XZwBJJUleAj4mqrg9QU1NvjX1koq6esQNrsyBX4fgV8QyEHUBvTGa3iDlylmSQ0VR';
    var publickey = 'BLTsx4emyHsflgGZf_OZqjj0qRX1vKR0CYIE3UfMuTj7ALdDLZ0gZOswuLn7bKtHOjdywuwx8HfrDAvm2RqAyao';

$scope.sendPushNotification = function () {
        var notification = {
    'title': 'Portugal vs. Denmark',
    'body': '5 to 1',
    'icon': 'firebase-logo.png',
    'click_action': 'http://localhost:8081'
    };
   
    navigator.serviceWorker.ready
      .then(function(registration) {
        //Get `push subscription`
        registration.pushManager.getSubscription().then(function (subscription) {
        console.log('Token : '+token);
       
       
          //Send `push notification` - source for below url `server.js`
          fetch('https://fcm.googleapis.com/fcm/send', {
          'method': 'POST',
          'headers': {
            'Authorization': 'key='+serverkey,
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify({
            'notification': notification,
            'to': token
          })
        }).then(function(response) {
          console.log(response);
        }).catch(function(error) {
          console.error(error);
        })
          /*fetch('/send_notification', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
          })
          .then(function(response) {
            console.log(response);
            return response.json();
          })*/
        })
      })
        // jQuery stuff
    }
});

app.controller('HomeCtrl', function($scope,$timeout,$location){
    var vm = this;
    vm.dataLoading = true;
	
    $timeout( function(){
            vm.dataLoading = false;
        }, 2000 );
    $scope.getClass = function (path) {
  return ($location.path().substr(0, path.length) === path) ? 'navigation__active' : '';

}
 $(window).on("scroll", function() {
                $(window).scrollTop() >= 20 ? $(".header").addClass("header--scrolled") : $(".header").removeClass("header--scrolled")
            });
    
});
app.controller('TableCtrl', function($scope,$timeout,$location){
    var vm = this;
    vm.dataLoading = true;
    
    $timeout( function(){
            vm.dataLoading = false;
        }, 2000 );
    $scope.getClass = function (path) {
  return ($location.path().substr(0, path.length) === path) ? 'navigation__active' : '';
}

 $(window).on("scroll", function() {
                $(window).scrollTop() >= 20 ? $(".header").addClass("header--scrolled") : $(".header").removeClass("header--scrolled")
            });
 
});
app.controller('LoginCtrl', function($scope,$location, AuthenticationService, FlashService){
	$scope.hideit  = true;
	var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
				
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
					console.log('res : '+response.message);
                    FlashService.Error(response.message,true);
                    vm.dataLoading = false;
                }
            });
        };
		
});
app.controller('RegisterCtrl', function($scope,$location,UserService, AuthenticationService, FlashService){
	$scope.hideit = true;
	var vm = this;

       
        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        };
});
app.run(function run($rootScope, $location, $cookies, $http,$anchorScroll) {
        // keep user logged in after page refresh
        $rootScope.hideit =false;
		if ($location.path() == '/login') {
				$rootScope.hideit = true;
		}else{
				$rootScope.hideit = false;
		}
		
		
		//########################
	
		document.addEventListener("deviceready", function() {
			console.log("deviceready");
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown(e) {
				e.preventDefault();
				if ($location.path() === "/login" || $location.path() === "/home") {
					var r=confirm("exit");
					if(r==true){
						console.log("not exit");
						navigator.app.exitApp();
					}else {
						navigator.app.goBack();
					}
				}else {
					/* $ionicHistory.goBack(); */
					window.history.back();
					navigator.app.goBack();
				}
			}
		}, 100);
				
		//########################
		
		
		
		
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
         $rootScope.$on('$locationChangeSuccess', function (event, next, current) {
                $(window).scrollTop(0);
                $('aside').removeClass("toggled");
                $('body').removeClass("aside-toggled");

            
        });
         console.log('Root Scope : '+$rootScope.hideit);
    });

$(window).on("load", function() {
    setTimeout(function() {
        $(".page-loader").fadeOut()
    }, 500)
}), $(window).on("scroll", function() {
    $(window).scrollTop() >= 20 ? $(".header").addClass("header--scrolled") : $(".header").removeClass("header--scrolled")
}), $(document).ready(function() {
    if ($(".clock")[0]) {
        var a = new Date;
        a.setDate(a.getDate()), setInterval(function() {
            var a = (new Date).getSeconds();
            $(".time__sec").html((a < 10 ? "0" : "") + a)
        }, 1e3), setInterval(function() {
            var a = (new Date).getMinutes();
            $(".time__min").html((a < 10 ? "0" : "") + a)
        }, 1e3), setInterval(function() {
            var a = (new Date).getHours();
            $(".time__hours").html((a < 10 ? "0" : "") + a)
        }, 1e3)
    }
    $("body").on("click", ".themes__item", function(a) {
        a.preventDefault(), $(".themes__item").removeClass("active"), $(this).addClass("active");
        var b = $(this).data("sa-value");
        $("body").attr("data-sa-theme", b)
    }), $("body").on("focus", ".search__text", function() {
        $(this).closest(".search").addClass("search--focus")
    }), $("body").on("blur", ".search__text", function() {
        $(this).val(""), $(this).closest(".search").removeClass("search--focus")
    }), $("body").on("click", ".navigation__sub > a", function(a) {
        a.preventDefault(), $(this).parent().toggleClass("navigation__sub--toggled"), $(this).next("ul").slideToggle(250)
    }), $(".form-group--float")[0] && ($(".form-group--float").each(function() {
        0 == !$(this).find(".form-control").val().length && $(this).find(".form-control").addClass("form-control--active")
    }), $("body").on("blur", ".form-group--float .form-control", function() {
        0 == $(this).val().length ? $(this).removeClass("form-control--active") : $(this).addClass("form-control--active")
    })), $("body").on("click", ".dropdown-menu--active", function(a) {
        a.stopPropagation()
    })
}), $("#dropzone-upload")[0] && (Dropzone.autoDiscover = !1), $(document).ready(function() {
    if ($("#data-table")[0]) {
        $("#data-table").DataTable({
            autoWidth: !1,
            responsive: !0,
            lengthMenu: [
                [15, 30, 45, -1],
                ["15 Rows", "30 Rows", "45 Rows", "Everything"]
            ],
            language: {
                searchPlaceholder: "Search for records..."
            },
            dom: "Blfrtip",
            buttons: [{
                extend: "excelHtml5",
                title: "Export Data"
            }, {
                extend: "csvHtml5",
                title: "Export Data"
            }, {
                extend: "print",
                title: "Material Admin"
            }],
            initComplete: function(a, b) {
                $(this).closest(".dataTables_wrapper").prepend('<div class="dataTables_buttons hidden-sm-down actions"><span class="actions__item zmdi zmdi-print" data-table-action="print" /><span class="actions__item zmdi zmdi-fullscreen" data-table-action="fullscreen" /><div class="dropdown actions__item"><i data-toggle="dropdown" class="zmdi zmdi-download" /><ul class="dropdown-menu dropdown-menu-right"><a href="" class="dropdown-item" data-table-action="excel">Excel (.xlsx)</a><a href="" class="dropdown-item" data-table-action="csv">CSV (.csv)</a></ul></div></div>')
            }
        }), $("body").on("click", "[data-table-action]", function(a) {
            a.preventDefault();
            var b = $(this).data("table-action");
            if ("excel" === b && $(this).closest(".dataTables_wrapper").find(".buttons-excel").trigger("click"), "csv" === b && $(this).closest(".dataTables_wrapper").find(".buttons-csv").trigger("click"), "print" === b && $(this).closest(".dataTables_wrapper").find(".buttons-print").trigger("click"), "fullscreen" === b) {
                var c = $(this).closest(".card");
                c.hasClass("card--fullscreen") ? (c.removeClass("card--fullscreen"), $("body").removeClass("data-table-toggled")) : (c.addClass("card--fullscreen"), $("body").addClass("data-table-toggled"))
            }
        })
    }
    if ($(".textarea-autosize")[0] && autosize($(".textarea-autosize")), $("input-mask")[0] && $(".input-mask").mask(), $("select.select2")[0]) {
        var a = $(".select2-parent")[0] ? $(".select2-parent") : $("body");
        $("select.select2").select2({
            dropdownAutoWidth: !0,
            width: "100%",
            dropdownParent: a
        })
    }
    if ($("#dropzone-upload")[0] && $("#dropzone-upload").dropzone({
            url: "/file/post",
            addRemoveLinks: !0
        }), $(".datetime-picker")[0] && $(".datetime-picker").flatpickr({
            enableTime: !0,
            nextArrow: '<i class="zmdi zmdi-long-arrow-right" />',
            prevArrow: '<i class="zmdi zmdi-long-arrow-left" />'
        }), $(".date-picker")[0] && $(".date-picker").flatpickr({
            enableTime: !1,
            nextArrow: '<i class="zmdi zmdi-long-arrow-right" />',
            prevArrow: '<i class="zmdi zmdi-long-arrow-left" />'
        }), $(".time-picker")[0] && $(".time-picker").flatpickr({
            noCalendar: !0,
            enableTime: !0
        }), $("#input-slider")[0]) {
        var b = document.getElementById("input-slider");
        noUiSlider.create(b, {
            start: [20],
            connect: "lower",
            range: {
                min: 0,
                max: 100
            }
        }), b.noUiSlider.on("update", function(a, b) {
            document.getElementById("input-slider-value").value = a[b]
        })
    }
    if ($("#input-slider-range")[0]) {
        var c = document.getElementById("input-slider-range"),
            d = document.getElementById("input-slider-range-value-1"),
            e = document.getElementById("input-slider-range-value-2"),
            f = [d, e];
        noUiSlider.create(c, {
            start: [20, 80],
            connect: !0,
            range: {
                min: 0,
                max: 100
            }
        }), c.noUiSlider.on("update", function(a, b) {
            f[b].value = a[b]
        })
    }
    if ($(".input-slider")[0])
        for (var g = document.getElementsByClassName("input-slider"), h = 0; h < g.length; h++) noUiSlider.create(g[h], {
            start: [20],
            connect: "lower",
            range: {
                min: 0,
                max: 100
            }
        });
    if ($(".color-picker")[0] && ($(".color-picker__value").colorpicker(), $("body").on("change", ".color-picker__value", function() {
            $(this).closest(".color-picker").find(".color-picker__preview").css("backgroundColor", $(this).val())
        })), $(".wysiwyg-editor")[0] && $(".wysiwyg-editor").trumbowyg({
            autogrow: !0
        }), $(".lightbox")[0] && $(".lightbox").lightGallery({
            enableTouch: !0
        }), $('[data-toggle="popover"]')[0] && $('[data-toggle="popover"]').popover(), $('[data-toggle="tooltip"]')[0] && $('[data-toggle="tooltip"]').tooltip(), $(".widget-calendar__body")[0]) {
        $(".widget-calendar__body").fullCalendar({
            contentHeight: "auto",
            theme: !1,
            buttonIcons: {
                prev: " zmdi zmdi-long-arrow-left",
                next: " zmdi zmdi-long-arrow-right"
            },
            header: {
                right: "next",
                center: "title, ",
                left: "prev"
            },
            defaultDate: "2016-08-12",
            editable: !0,
            events: [{
                title: "Dolor Pellentesque",
                start: "2016-08-01"
            }, {
                title: "Purus Nibh",
                start: "2016-08-07"
            }, {
                title: "Amet Condimentum",
                start: "2016-08-09"
            }, {
                title: "Tellus",
                start: "2016-08-12"
            }, {
                title: "Vestibulum",
                start: "2016-08-18"
            }, {
                title: "Ipsum",
                start: "2016-08-24"
            }, {
                title: "Fringilla Sit",
                start: "2016-08-27"
            }, {
                title: "Amet Pharetra",
                url: "http://google.com/",
                start: "2016-08-30"
            }]
        });
        var i = moment().format("YYYY"),
            j = moment().format("dddd, MMM D");
        $(".widget-calendar__year").html(i), $(".widget-calendar__day").html(j)
    }
    if ($(".notes__body")[0]) {
        var k;
        $(".notes__body").each(function(a, b) {
            k = $(this).prev().is(".notes__title") ? 4 : 6, $clamp(b, {
                clamp: k
            })
        })
    }
    $(".scrollbar-inner")[0] && $(".scrollbar-inner").scrollbar().scrollLock();
    var l = [{
            name: "node1",
            children: [{
                name: "node1_1",
                children: [{
                    name: "node1_1_1"
                }, {
                    name: "node1_1_2"
                }, {
                    name: "node1_1_3"
                }]
            }, {
                name: "node1_2"
            }, {
                name: "node1_3"
            }]
        }, {
            name: "node2",
            children: [{
                name: "node2_1"
            }, {
                name: "node2_2"
            }, {
                name: "node2_3"
            }]
        }, {
            name: "node3",
            children: [{
                name: "node3_1"
            }, {
                name: "node3_2"
            }, {
                name: "node3_3"
            }]
        }],
        m = [{
            name: "node1",
            children: [{
                name: "node1_1"
            }, {
                name: "node1_2"
            }, {
                name: "node1_3"
            }]
        }, {
            name: "node2",
            children: [{
                name: "node2_1"
            }, {
                name: "node2_2"
            }, {
                name: "node2_3"
            }]
        }],
        n = [{
            label: "node1",
            children: [{
                name: '<a href="example1.html">node1_1</a>'
            }, {
                name: '<a href="example2.html">node1_2</a>'
            }, '<a href="example3.html">Example </a>']
        }];
    $(".treeview")[0] && $(".treeview").tree({
        data: l,
        closedIcon: $('<i class="zmdi zmdi-plus"></i>'),
        openedIcon: $('<i class="zmdi zmdi-minus"></i>')
    }), $(".treeview-expanded")[0] && $(".treeview-expanded").tree({
        data: m,
        autoOpen: !0,
        closedIcon: $('<i class="zmdi zmdi-plus"></i>'),
        openedIcon: $('<i class="zmdi zmdi-minus"></i>')
    }), $(".treeview-drag")[0] && $(".treeview-drag").tree({
        data: m,
        dragAndDrop: !0,
        autoOpen: !0,
        closedIcon: $('<i class="zmdi zmdi-plus"></i>'),
        openedIcon: $('<i class="zmdi zmdi-minus"></i>')
    }), $(".treeview-drag")[0] && $(".treeview-drag").tree({
        data: m,
        dragAndDrop: !0,
        autoOpen: !0,
        closedIcon: $('<i class="zmdi zmdi-plus"></i>'),
        openedIcon: $('<i class="zmdi zmdi-minus"></i>')
    }), $(".treeview-escape")[0] && $(".treeview-escape").tree({
        data: n,
        autoEscape: !1,
        autoOpen: !0,
        closedIcon: $('<i class="zmdi zmdi-plus"></i>'),
        openedIcon: $('<i class="zmdi zmdi-minus"></i>')
    }), $(".rating")[0] && $(".rating").each(function() {
        var a = $(this).data("rating");
        $(this).rateYo({
            rating: a,
            normalFill: "rgba(255,255,255,0.3)",
            ratedFill: "#ffc107"
        })
    }), $(".text-counter")[0] && $(".text-counter").each(function() {
        var a = $(this).data("min-length") || 0,
            b = $(this).data("max-length");
        $(this).textcounter({
            min: a,
            max: b,
            countDown: !0,
            inputErrorClass: "is-invalid",
            counterErrorClass: "text-orange"
        })
    })
}), $(document).ready(function() {
    function a(a) {
        a.requestFullscreen ? a.requestFullscreen() : a.mozRequestFullScreen ? a.mozRequestFullScreen() : a.webkitRequestFullscreen ? a.webkitRequestFullscreen() : a.msRequestFullscreen && a.msRequestFullscreen()
    }
    $("body").on("click", "[data-sa-action]", function(b) {
        b.preventDefault();
        var c = $(this),
            d = c.data("sa-action"),
            e = "";
        switch (d) {
            case "search-open":
                $(".search").addClass("search--toggled");
                break;
            case "search-close":
                $(".search").removeClass("search--toggled");
                break;
            case "aside-open":
                e = c.data("sa-target"), c.addClass("toggled"), $("body").addClass("aside-toggled"), $(e).addClass("toggled"), $(".content, .header").append('<div class="sa-backdrop" data-sa-action="aside-close" data-sa-target=' + e + " />");
                break;
            case "aside-close":
                e = c.data("sa-target"), $("body").removeClass("aside-toggled"), $('[data-sa-action="aside-open"], ' + e).removeClass("toggled"), $(".content, .header").find(".sa-backdrop").remove();
                break;
            case "fullscreen":
                a(document.documentElement);
                break;
            case "print":
                window.print();
                break;
            case "login-switch":
                e = c.data("sa-target"), $(".login__block").removeClass("active"), $(e).addClass("active");
                break;
            case "notifications-clear":
                b.stopPropagation();
                var f = $(".top-nav__notifications .listview__item"),
                    g = f.length,
                    h = 0;
                c.fadeOut(), f.each(function() {
                    var a = $(this);
                    setTimeout(function() {
                        a.addClass("animated fadeOutRight")
                    }, h += 150)
                }), setTimeout(function() {
                    f.remove(), $(".top-nav__notifications").addClass("top-nav__notifications--cleared")
                }, 180 * g);
                break;
            case "toolbar-search-open":
                $(this).closest(".toolbar").find(".toolbar__search").fadeIn(200), $(this).closest(".toolbar").find(".toolbar__search input").focus();
                break;
            case "toolbar-search-close":
                $(this).closest(".toolbar").find(".toolbar__search input").val(""), $(this).closest(".toolbar").find(".toolbar__search").fadeOut(200)
        }
    })
});