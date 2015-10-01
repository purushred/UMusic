angular.module('movieApp.controllers',[]).controller('MovieListController',function($scope,$state,popupService,$window,Movie){

    $scope.movies=Movie.query();

    $scope.deleteMovie=function(movie){
        console.log("Delete Movie:",movie);
        $scope.movie=Movie.get({youtubeUrl:movie.youtubeUrl});       
    }

}).controller('MovieViewController',function($scope,$stateParams,Movie){

    $scope.movie=Movie.get({id:$stateParams.id});

}).controller('MovieCreateController',function($scope,$state,$stateParams,Movie){

$scope.gridOptions = { 
        data: 'songs',
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        columnDefs: [{field: 'youtubeUrl', displayName: 'Song URL', enableCellEdit: true}, 
                     {field:'song', displayName:'Song Name', enableCellEdit: true}, 
                     {field:'singer', displayName:'Singer', enableCellEdit: true}, 
                     {field:'lyricist', displayName:'Lyricist', enableCellEdit: true}]
    };

    $scope.movie=new Movie();
    $scope.songs=new Array();
    $scope.song = {'youtubeUrl':'','song':'','singer':'','lyricist':''};
    $scope.songs.push($scope.song);
    $scope.addMovie=function(){
        console.log("Movie adding successful.");
        $scope.movie.songs = $scope.songs;
        $scope.movie.$save(function(){
	    alert("Created successfully");
            //$state.go('movies');
        });
    }
    $scope.newEntry = function() {
        console.log("New entry");
        $scope.song = {'youtubeUrl':'','song':'','singer':'','lyricist':''};
        $scope.songs.push($scope.song);   
    }

}).controller('MovieEditController',function($scope,$state,$stateParams,Movie){

    $scope.updateMovie=function(){
        $scope.movie.$update(function(){
            $state.go('movies');
        });
    };

    $scope.loadMovie=function(){
        $scope.movie=Movie.get({id:$stateParams.id});
    };

    $scope.loadMovie();
});
