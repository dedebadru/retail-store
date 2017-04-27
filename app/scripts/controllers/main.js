'use strict';

/**
 * @ngdoc function
 * @name retailStoreNg1App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the retailStoreNg1App
 */
angular.module('retailStoreNg1App')
  .controller('MainCtrl', function($scope, $http) {
    $scope.users = [
      {id: 1, name: "hendro", type: "employee", join_date: "2015-08-10"},
      {id: 2, name: "susan", type: "affiliate", join_date: "2016-09-12"},
      {id: 3, name: "budi", type: "customer", join_date: "2017-04-10"},
      {id: 4, name: "nanda", type: "customer", join_date: "2012-02-02"}
    ];

    $scope.products = [
      { id : 1, name: "meatball", type: "groceries", price: 3},
      { id : 2, name: "bread", type: "groceries", price: 2},
      { id : 3, name: "flashdisk", type: "electronics", price: 10},
      { id : 4, name: "Battery", type: "electronics", price: 1},
      { id : 5, name: "lamp", type: "electronics", price: 5}
    ];

    $scope.selected = {};
    $scope.userSelected = $scope.users[0];
    $scope.selectedProducts = [];
    $scope.additionalInfo = {
      total: 0,
      nominalDiscount: 0,
      afterDiscount: 0
    }

    $scope.addProduct = function(){
      if($scope.selected.product === undefined || $scope.selected.qty === undefined || $scope.selected.qty < 1){
        alert("Please select product and contents qty more than 0.");
        return false;
      }

      if($scope.selected.product.type === "groceries"){
        $scope.selectedProducts.push({name: $scope.selected.product.name, qty: $scope.selected.qty, price: $scope.selected.price, subtotal: $scope.selected.subtotal, product_discount: false});
      }else{
        $scope.selectedProducts.push({name: $scope.selected.product.name, qty: $scope.selected.qty, price: $scope.selected.price, subtotal: $scope.selected.subtotal, product_discount: true});
      }

      $scope.selected = {};
      countTotalPrice();
    }

    $scope.removeProduct = function(product){
      $scope.selectedProducts.splice($scope.selectedProducts.indexOf(product), 1);
      countTotalPrice();
    }

    $scope.priceSubTotal = function(){
      if($scope.selected.product){
        $scope.selected.price = $scope.selected.product.price;
      }else{
        $scope.selected.price = 0;
      }

      if($scope.selected.product && $scope.selected.qty){
        $scope.selected.subtotal = $scope.selected.product.price * $scope.selected.qty;
      }else{
        $scope.selected.subtotal = 0;
      }
    }

    var countTotalPrice = function(){
      var percenDiscount, productDiscount, totalProductDiscount, nominalDiscount, productAll, nominalAll, totalAfterDiscount;

      if ($scope.userSelected.type === "employee"){
        percenDiscount = 30;
      } else if ($scope.userSelected.type === "affiliate"){
        percenDiscount = 10;
      } else if ($scope.userSelected.type === "customer" && $scope.userSelected.join_date === true){
        percenDiscount = 5;
      } else {
        percenDiscount = 0;
      }

      productDiscount = $scope.selectedProducts.map(function(product){
        if(product.product_discount === true){
          return product.subtotal;
        };
      });

      totalProductDiscount = productDiscount.reduce(function(sum, value){
        if(value === undefined){
          return sum + 0;
        }else{
          return sum + value;
        }
      }, 0);

      nominalDiscount = totalProductDiscount*percenDiscount/100;

      productAll = $scope.selectedProducts.map(function(product){
        return product.subtotal;
      });

      nominalAll = productAll.reduce(function(sum, value){
        return sum + value;
      }, 0);

      nominalDiscount = nominalDiscount + ((nominalAll - (nominalAll % 100)) / 100 * 5);

      totalAfterDiscount = nominalAll - nominalDiscount;

      $scope.additionalInfo = {
        total: nominalAll,
        nominalDiscount: nominalDiscount,
        afterDiscount: totalAfterDiscount
      }
    }

    var isOverTwoYear = function(date){
      var currentDate = new Date();
      var joinDate    = new Date(date);
      var timeDiff    = Math.abs(currentDate.getTime() - joinDate.getTime());
      var diffDays    = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return diffDays > (365*2);
    }
  });
