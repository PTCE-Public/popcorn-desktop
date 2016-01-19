(function (App) {
    'use strict';

    var Q = require('q');
    var request = require('request');
    var inherits = require('util').inherits;

    function YTS() {
        if (!(this instanceof YTS)) {
            return new YTS();
        }

        App.Providers.Generic.call(this);
    }
    inherits(YTS, App.Providers.Generic);

    YTS.prototype.extractIds = function (items) {
        return _.pluck(items.results, 'imdb_id');
    };

    var format = function (data) {
        var results = _.chain(data)
            .filter(function (movie) {
                // Filter any 3D only movies
                return _.any(movie.torrents, function (torrent) {
                    return torrent.quality !== '3D';
                });
            }).map(function (movie) {
                return {
                    type: 'movie',
                    imdb_id: movie.imdb_id,
                    title: movie.title,
                    year: movie.year,
                    genre: movie.genres,
                    rating: movie.rating,
                    runtime: movie.runtime,
                    image: movie.images.poster,
                    cover: movie.images.poster,
                    backdrop: movie.images.poster,
                    synopsis: movie.plot,
                    trailer: 'https://www.youtube.com/watch?v=' + movie.yt_trailer_code || false,
                    //certification: movie.mpa_rating,
                    torrents: _.reduce(movie.torrents, function (torrents, torrent) {
                        if (torrent.quality !== '3D') {
                            torrents[torrent.quality] = {
                                //url: torrent.url,
                                magnet: 'magnet:?xt=urn:btih:' + torrent.hash +
                                '&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce'
                                + '&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80'
                                + '&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969'
                                + '&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
                                size: torrent.size,
                                filesize: torrent.size,
                                seed: torrent.seeds,
                                peer: torrent.peers,
                                scraper: torrent.scraper
                            };
                        }
                        return torrents;
                    }, {})
                };
            }).value();

        return {
            results: Common.sanitize(results),
            hasMore: true //data.movie_count > data.page_number * data.limit
        };
    };

    YTS.prototype.fetch = function (filters) {
        var params = {
            sort: 'seeds',
            limit: 50,
            page: 1
        };

        if (filters.page) {
            params.page = filters.page;
        }

        if (filters.keywords) {
            params.keywords = filters.keywords;
        }

        if (filters.genre && filters.genre !== 'All') {
            params.genre = filters.genre;
        }

        if (filters.order === 1) {
            params.order_by = 'asc';
        }

        if (filters.sorter && filters.sorter !== 'popularity') {
            switch (filters.sorter) {
                case 'last added':
                    params.sort = 'year';
                    break;
                case 'trending':
                    params.sort = 'trending_score';
                    break;
                default:
                    params.sort = filters.sorter;
            }
        }

        if (Settings.movies_quality !== 'all') {
            params.quality = Settings.movies_quality;
        }

        if (Settings.translateSynopsis) {
            params.lang = Settings.language;
        }

        var defer = Q.defer();

        function get(index) {
            var options = {
                uri: Settings.movieAPI[index].uri + 'movies',
                qs: params,
                json: true,
                timeout: 10000
            };
            var req = jQuery.extend(true, {}, Settings.movieAPI[index], options);
            request(req, function (err, res, data) {
                if (err || res.statusCode >= 400 || (!data)) {
                    win.warn('YTS API endpoint \'%s\' failed.', Settings.movieAPI[index].uri);
                    if (index + 1 >= Settings.movieAPI.length) {
                        return defer.reject(err || 'Status Code is above 400');
                    } else {
                        get(index + 1);
                    }
                } else {
                    return defer.resolve(format(data));
                }
            });
        }
        get(0);

        return defer.promise;
    };

    /*
    YTS.prototype.random = function () {
        var defer = Q.defer();

        function get(index) {
            var options = {
                uri: Settings.movieAPI[index].uri + 'api/v2/get_random_movie.json?' + Math.round((new Date()).valueOf() / 1000),
                json: true,
                timeout: 10000
            };
            var req = jQuery.extend(true, {}, Settings.movieAPI[index], options);
            request(req, function (err, res, data) {
                if (err || res.statusCode >= 400 || (data && !data.data)) {
                    win.warn('YTS API endpoint \'%s\' failed.', Settings.movieAPI[index].uri);
                    if (index + 1 >= Settings.movieAPI.length) {
                        return defer.reject(err || 'Status Code is above 400');
                    } else {
                        get(index + 1);
                    }
                    return;
                } else if (!data || data.status === 'error') {
                    err = data ? data.status_message : 'No data returned';
                    return defer.reject(err);
                } else {
                    return defer.resolve(Common.sanitize(data));
                }
            });
        }
        get(0);

        return defer.promise;
    }; */

    YTS.prototype.detail = function (torrent_id, old_data) {
        return Q(old_data);
    };

    App.Providers.Yts = YTS;

})(window.App);