//$("#btnCreate").on('click', function (e) {
//    ///$('#progress').show();
//    $.ajax({
//        url: '/Country/Create',
//        type: 'GET',
//        success: function (data) {
//            // $("#progress").hide();
//            $("#modalArea").html(data);
//            $('#modalArea').modal('toggle')
//        }
//    });
//});


//function EditCountry(Id) {

//    $.ajax({
//        url: '/Country/Edit',
//        type: 'GET',
//        data: { Id: Id },
//        success: function (data) {

//            $("#modalArea").html(data);
//            $('#modalArea').modal('toggle')
//        }
//    });
//}

//function DeleteCountry(Id) {

//    if (confirm('Do you want to delete?')) {
//        $.ajax({
//            url: '/Country/Delete',
//            type: 'POST',
//            data: { Id: Id },
//            success: function (data) {
//                if (data) {
//                    Reload();
//                }
//                else {
//                    alert(' Cannot delete this country');
//                }
//            }
//        });
//    }
//}

//function Reload() {
//    $.ajax({
//        url: '/Country/GetList',
//        type: 'GET',
//        success: function (data) {
//            $("#lstCountry").html(data);
//        }
//    });
//}

(function () {
    var app = angular.module('CountryApp', ['ngRoute', 'ui.bootstrap']);

    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/Country/Edit', {
            templateUrl: 'Partials/editpopup.html', controller: 'CountryController'
        });

        $locationProvider.html5Mode(true);
    });


    app.service('CountryService', function ($http, $q) {
        var countries = [];
        var roles = [];
        var country = new Object();

        //get list membership package
        this.getCountries = function (Id) {
            var url = typeof Id === 'undefined' ? '/Country/GetList' : '/Country/Get/';
            //var method = typeof Id === 'undefined' ? 'Get' : 'Post';
            var qdefer = $q.defer();

            $http({
                method: 'Post',
                url: url,
                data: { Id: Id },
                async: false,
            }).success(function (data, status, headers, config) {
                qdefer.resolve(data);

            }).error(function (data, status, headers, config) {
                alert('error!')
            });

            return qdefer.promise;
        };


        //edit list membership package
        this.saveCountry = function (country) {
            var qdefer = $q.defer();
            $http({
                method: 'Post',
                url: '/Country/Edit',
                data: { country: country },
                async: false,
            }).success(function (data, status, headers, config) {
                qdefer.resolve(data);

            }).error(function (data, status, headers, config) {
                alert('error!')
            });

            return qdefer.promise;
        };
    });


    app.controller('countryController', function ($scope, CountryService, $modal) {

        $scope.countries = CountryService.getCountries();
        $scope.EditCountry = function (country, $index) {
            var modalInstance = $modal.open({
                templateUrl: 'Partials/editpopup.html',
                controller: 'ModalCountry',
                scope : $scope,
                resolve: {
                    country: function () {
                        return angular.copy(country);
                    }
                }
            });

        };
    });

    app.controller('ModalCountry', function ($scope, $modalInstance, country, CountryService) {
        $scope.selectedCountry = country;
        $scope.save = function (country) {           
            CountryService.saveCountry(country);
            $modalInstance.dismiss('cancel');
            $scope.countries = CountryService.getCountries();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

})();




