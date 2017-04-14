/*
 *  Create By : Priyank Kumar on April 7 2017
 */
(function () {
    console.log(angular);
    angular
        .module("Evento", ["ngRoute"])
        .controller("EventoController", eventoController);

    function eventoController($route, $anchorScroll, $location) {
        var vm = this;

        vm.switchTo = switchTo;

        function switchTo(element) {
            var previousValue = $location.hash();

            $location.hash(element);
            $anchorScroll();
            // Reset to the old one
            $location.hash(previousValue);
        }
    }
})();