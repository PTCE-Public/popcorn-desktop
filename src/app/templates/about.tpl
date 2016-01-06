<div class="about-container">
    <div class="fa fa-times close-icon"></div>
    <div class="overlay-content"></div>
    <div class="margintop"></div>
    <img class="icon-title" src="/src/app/images/popcorn-time-logo.svg">
    <div class="content">

        <div class="title-version">
            <a data-toggle="tooltip" data-placement="top" title=<%= i18n.__("Changelog") %> id='changelog'><%= App.settings.version %> "<%= App.settings.releaseName %>" Beta </a>
            <% if(App.git) { %>
                - <small><i><%= App.git.branch %> (<a class="links" href="https://git.popcorntime.ml/popcorntime/desktop/commit/<%= App.git.commit %>"><%= App.git.commit.slice(0,8) %></a>)</i></small>
            <% } %>
        </div>

        <div class="title-issue">
            <!--<a><%= i18n.__("Report an issue") %></a>--><!-- removed as we dont use gitlab-->
            <a href="https://github.com/PopcornTimeCE/desktop/issues" data-toggle="tooltip" data-placement="top" title="git.popcorntime.ml" class='links'>Report an issue</a>
        </div>

        <div class="text-about">
            <div class="full-text">
                <%= i18n.__("Popcorn Time CE is the result of many developers and designers putting a bunch of APIs together to make the experience of watching torrent movies as simple as possible.") %><br/>
                <%= i18n.__("We are an open source project. We are from all over the world. We love our movies. And boy, do we love popcorn.") %>
            </div>
        </div>

        <div class="icons_social">
            <a href='https://popcorntime.ml' data-toggle="tooltip" data-placement="top" title="popcorntime.ml" class='links site_icon'></span></a>
            <a href='https://discuss.popcorntime.ml' data-toggle="tooltip" data-placement="top" title="discuss.popcorntime.ml" class='links forum_icon'></span></a>
            <a href='https://git.popcorntime.ml' data-toggle="tooltip" data-placement="top" title="git.popcorntime.ml" class='links stash_icon'></span></a>
        </div>

        <div class="last-line">
            <%= i18n.__("Made with") %> <span style="color:#e74c3c;">&#10084;</span> <%= i18n.__("by a bunch of geeks from All Around The World") %>
        </div>

    </div>
    <div class="changelog-overlay">
        <div class="title"><%=i18n.__("Changelog")%></div>
        <div class="changelog-text"></div>    
    </div>
</div>
