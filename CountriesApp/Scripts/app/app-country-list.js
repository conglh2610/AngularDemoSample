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
        this.getCountries = function (Id, page, pageSize, column, isDesc) {
            var url = Id == 0 ? '/Country/GetListPaging' : '/Country/Get/';
            //var method = typeof Id === 'undefined' ? 'Get' : 'Post';
            var qdefer = $q.defer();

            $http({
                method: 'Post',
                url: url,
                data: { Id: Id, page: page, pageSize: pageSize, column: column, isDesc: isDesc },
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
            var url = typeof country.Id === 'undefined' ? '/Country/Create' : '/Country/Edit';
            var qdefer = $q.defer();
            $http({
                method: 'Post',
                url: url,
                data: { country: country },
                async: false,
            }).success(function (data, status, headers, config) {
                qdefer.resolve(data);

            }).error(function (data, status, headers, config) {
                alert('error!')
            });

            return qdefer.promise;
        };

        // delete country
        this.deleteCountry = function (country) {
            if (typeof country.Id === 'undefined')
                return;
            var qdefer = $q.defer();
            $http({
                method: 'Post',
                url: '/Country/Delete',
                data: { Id: country.Id },
                async: false
            }).success(function (data, status, headers, config) {
                qdefer.resolve(data);
            }).error(function (data, status, headers, config) {
                alert('error!');
            })
            return qdefer.promise;
        }
    });

    // country controller
    app.controller('countryController', function ($scope, CountryService, $modal) {

        //$scope.isSearching = false;
        //$scope.page = 0;
        //$scope.pagesCount = 0;

        $scope.sort = {
            column: 'Name',
            descending: false,
            pageSize: 5,
            isSearching: false,
            page: 0,
            pagesCount : 0
        };

        $scope.selectedCls = function (column) {
            return column == $scope.sort.column && 'sort-' + $scope.sort.descending;
        };

        $scope.SortChange = function (column) {
            var sort = $scope.sort;

            if ($scope.sort.column == column) {
                $scope.sort.descending = !sort.descending;
            }
            else {
                $scope.sort.column = column;
                $scope.sort.descending = false;
            }

            CountryService.getCountries(0, $scope.sort.page , $scope.sort.pageSize, $scope.sort.column, $scope.sort.descending).then(_onSuccess, _onError);
        }

        $scope.headers = ["Name", "Code", "Abrev"];

        var _onSuccess = function (value) {
            $scope.countries = value.Items;
            $scope.sort.page = value.Page;
            $scope.sort.pagesCount = value.TotalPages;
            $scope.Data = value;
            $scope.sort.isSearching = false;
        };
        var _onError = function () {
            $scope.sort.isSearching = false;
        };

        //$scope.countries = CountryService.getCountries(0, 1, $scope.sort.pageSize, $scope.sort.column, $scope.sort.descending).then(_onSuccess, _onError);

        $scope.EditCountry = function (country) {
            var modalInstance = $modal.open({
                templateUrl: 'Partials/editpopup.html',
                controller: 'ModalCountry',
                scope: $scope,
                resolve: {
                    country: function () {
                        return angular.copy(country);
                    }
                }
            }).result.then(function (response) {
                CountryService.getCountries(0, $scope.sort.pageSize, $scope.sort.pageSize, $scope.sort.column, $scope.sort.descending).then(_onSuccess, _onError);
            });
        };

        $scope.DeleteCountry = function (country) {
            CountryService.deleteCountry(country).then(function () {
                $.each($scope.countries, function (i) {
                    if ($scope.countries[i].Id == country.Id)
                        $scope.countries.splice(i, 1);
                })
            }, function (response) {
                alert(response);
            });
        };
        $scope.search = function (page) {
            $scope.sort.page = page || 0;
            CountryService.getCountries(0, $scope.sort.page, $scope.sort.pageSize, $scope.sort.column, $scope.sort.descending).then(_onSuccess, _onError);
        }
        $scope.search();
    });
    // Modal dialog create/edit
    app.controller('ModalCountry', function ($scope, $modalInstance, country, CountryService) {
        $scope.selectedCountry = country;
        $scope.save = function (country) {
            CountryService.saveCountry(country).then(function () {
                $modalInstance.close();
            });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    // Paging directive
    /*************************************************************************/
    // DIRECTIVES

    app.directive('demoPager', function () {
        return {
            restrict: 'E',
            templateUrl: 'Templates/pager-template.html',
            controller: ['$scope', function ($scope) {
                $scope.range = function () {
                    var step = 2;
                    var doubleStep = step * 2;
                    var start = Math.max(0, $scope.sort.page - step);
                    var end = start + 1 + doubleStep;
                    if (end > $scope.sort.pagesCount) { end = $scope.sort.pagesCount; }

                    var ret = [];
                    for (var i = start; i != end; ++i) {
                        ret.push(i);
                    }

                    return ret;
                };
            }]
        }
    });

})();




