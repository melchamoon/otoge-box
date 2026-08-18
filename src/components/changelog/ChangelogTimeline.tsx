"use client";

const updates = [
  {
    title: "2025/10/14－ v3.32 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>MÚSECA</strong> >> <a href="https://arcade-songs.zetaraku.dev/museca/" target="_blank">MÚSECA | arcade-songs</a>',
      "ui: (Filter) spilt and sort extra difficulties filter options by sheet count",
    ],
  },
  {
    title: "2025/09/21 － v3.31.1 Update",
    variant: "minor",
    items: [
      "bugfix: (My List / Gallery) fix bug that opens camera when selecting file",
      "bugfix: (Gallery) fix missing disclaimer text on gallery page",
    ],
  },
  {
    title: "2025/09/16 － 100 stars on GitHub",
    variant: "milestone",
    items: [
      'milestone: 100 stars on <a class="text-decoration-none" href="https://github.com/zetaraku/arcade-songs" target="_blank"> <span>zetaraku/arcade-songs</span> </a> !',
    ],
  },
  {
    title: "2025/07/10 － v3.31 Update",
    variant: "update",
    items: [
      'feature: (Timeline) add "Timeline"',
      "bugfix: (Portal) sidebar portal is now scrollable when overflowed",
      'i18n: (Site) Vietnamese (vi) locale is now available! <i>(Thanks <a href="https://github.com/Kirigamisensei" target="_blank">@Kirigamisensei</a> !)</i>',
    ],
  },
  {
    title: "2025/07/07 － v3.30.1 Update",
    variant: "minor",
    items: [
      "ui: (List View) adjust table columns",
      "bugfix: (My List) fix sheet selection problem when region override is enabled",
      "misc: use <strong>ノスタルジア</strong> instead of <strong>NOSTALGIA</strong> as its game title",
    ],
  },
  {
    title: "2025/06/20 － v3.30 Update",
    variant: "update",
    items: ["feature: (Filter) add special difficulties in filter options"],
  },
  {
    title: "2025/06/18－ v3.29 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>ポラリスコード</strong> >> <a href="https://arcade-songs.zetaraku.dev/polarischord/" target="_blank">ポラリスコード | arcade-songs</a>',
    ],
  },
  {
    title: "2025/06/08 － v3.28 Update",
    variant: "mystery",
    items: [
      "ui: adjust My List toggle button style on Sheet Dialog",
      "feature: (My List) allow toggling My List with right-click on Sheet Tile everywhere",
      "feature: (???) <strong>Annihilation</strong> was claimed to be now reproducible in a controlled environment, but <i>how?</i>",
    ],
  },
  {
    title: "2025/06/06 － v3.27 Update",
    variant: "update",
    items: [
      "feature: (Sheet Dialog) allow toggling My List in Sheet Dialog",
      "ui: (Site) adjust index page layout",
      "ui: (Sheet Dialog) do not hide YouTube link when drawing sheet",
      "bugfix: clear up blindfolds when viewing sheet combo",
    ],
  },
  {
    title: "2025/05/19－ v3.26 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>GITADORA</strong> >> <a href="https://arcade-songs.zetaraku.dev/gitadora/" target="_blank">GITADORA | arcade-songs</a>',
      '<i>"Let\'s ROCK!!!!!"</i>',
    ],
  },
  {
    title: "2025/04/09 － 1,000,000 visits reached",
    variant: "milestone",
    items: [
      'milestone: 1,000,000 visits reached on <a href="https://arcade-songs.zetaraku.dev/maimai/" target="_blank">arcade-songs/maimai</a>!',
    ],
  },
  {
    title: "2025/03/16 － v3.25 Update",
    variant: "update",
    items: [
      "feature: (Filter) allow exact match on title and artist",
      'ui: (List View) add "Release Date" column',
      'bugfix: (Filter) do not build level filter options from levels that end with "?"',
      "misc: (Filter) improve filter performance",
      "misc: (Site) improve game data matching performance",
    ],
  },
  {
    title: "2025/02/22 － v3.24 Update",
    variant: "update",
    items: [
      "ui: (Filter) open a dialog with instructions to edit the Super Filter",
      "bugfix: (Filter) remove misconfigured style for multi-select",
    ],
  },
  {
    title: "2025/01/04 － v3.23.1 Update",
    variant: "minor",
    items: [
      "ui: (Summary View) hide tooltip and reduce axis pointer animation on mobile",
      "bugfix: (Summary View) fix dialog flashing problem when viewing sheets",
    ],
  },
  {
    title: "2025/01/03 － v3.23 Update",
    variant: "update",
    items: [
      "feature: (Summary View) allow clicking on chart to view sheets in the bar",
      'misc: (Sheet Drawer) add "View Mode" for viewing sheets',
    ],
  },
  {
    title: "2024/12/29 － v3.22 Update",
    variant: "update",
    items: [
      "feature: (Summary View) add Summary View",
      "ui: (Sheet Drawer) fix width calculation logic in Sheet Combo Drawer",
      "misc: (Site) track more interaction event for development insight >:)",
    ],
  },
  {
    title: "2024/11/11 － v3.21 Update",
    variant: "update",
    items: [
      'feature: (Filter) display regional info instead if "Use Regional Info Override" is enabled',
    ],
  },
  {
    title: "2024/09/04 － v3.20 Update",
    variant: "update",
    items: [
      'feature: (Filter) add "Sync Level" and "Sync BPM" filter options',
      "ui: (Filter) fix filter option button overflow problem",
      "ui: (Site) adjust page padding on small devices",
    ],
  },
  {
    title: "2024/09/02 － v3.19 Update",
    variant: "update",
    items: [
      'feature: (Filter) add "Use Regional Info Override" option on "Region" filter',
    ],
  },
  {
    title: "2024/08/19 － v3.18 Update",
    variant: "update",
    items: [
      'feature: (Filter) add "Super Filter" 💪✨',
      "<i>Now everyone should learn JavaScript</i> 😉",
    ],
  },
  {
    title: "2024/07/22 － v3.17 Update",
    variant: "mystery",
    items: [
      'feature: (My List) add "Pick one from filter" button',
      "feature: (???) Don't trust your eyes! A new <strong>light switch</strong> was installed when you left, but <i>where is it?</i>",
    ],
  },
  {
    title: "2024/06/21 － 500000 visits reached",
    variant: "milestone",
    items: [
      'milestone: 500000 visits reached on <a href="https://arcade-songs.zetaraku.dev/maimai/" target="_blank">arcade-songs/maimai</a>!',
    ],
  },
  {
    title: "2024/04/25 － v3.16 Update",
    variant: "update",
    items: [
      "feature: (Data) add sheet internal level information for <strong>ノスタルジア</strong>",
      'Data source: <a class="text-decoration-none" href="https://twitter.com/nosdata" target="_blank"> <span>Nosdata</span> </a> / <a href="https://nosdata.info/" target="_blank">Nosdata</a> <i> (Thanks <a href="https://twitter.com/exponent_iidx" target="_blank">@exponent_iidx</a> & <a href="https://twitter.com/nosdata" target="_blank">@nosdata</a> !) </i>',
    ],
  },
  {
    title: "2024/04/19 － v3.15 Update",
    variant: "update",
    items: ['feature: (Data) add "comment" field for songs'],
  },
  {
    title: "2024/04/11 － v3.14.1 Update",
    variant: "minor",
    items: [
      "misc: (Data) the song list of <strong>オンゲキ</strong> is now complete! (70 deleted songs added)",
    ],
  },
  {
    title: "2024/04/07 － v3.14 Update",
    variant: "update",
    items: [
      'feature: (Sheet Drawer) add "Blindfold Mode" in Sheet Combo Drawer 😎',
      "misc: (Sheet Drawer) now the settings in the Sheet Combo Drawer are preserved",
    ],
  },
  {
    title: "2024/04/06 － v3.13 Update",
    variant: "update",
    items: [
      "feature: (Sheet Drawer) allow user to config draw size of Sheet Combo Drawer",
      "misc: (Gallery) now gallery page will use id instead of title in the url",
    ],
  },
  {
    title: "2024/01/15 － v3.12.1 Update",
    variant: "minor",
    items: [
      'i18n: (Site) Russian (ru) locale is now available! <i>(Thanks <a href="https://github.com/SaGeDeveloper" target="_blank">@SaGeDeveloper</a> & <a href="https://github.com/lookeey1" target="_blank">@lookeey1</a> !)</i>',
    ],
  },
  {
    title: "2023/12/21 － v3.12 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>REFLEC BEAT</strong> >> <a href="https://arcade-songs.zetaraku.dev/rb/" target="_blank">REFLEC BEAT | arcade-songs</a>',
      "<i>And here comes another lost game ...</i>",
    ],
  },
  {
    title: "2023/12/19 － 250000 visits reached",
    variant: "milestone",
    items: [
      'milestone: 250000 visits reached on <a href="https://arcade-songs.zetaraku.dev/maimai/" target="_blank">arcade-songs/maimai</a>!',
    ],
  },
  {
    title: "2023/11/20 － v3.11 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>crossbeats REV.</strong> >> <a href="https://arcade-songs.zetaraku.dev/crossbeats/" target="_blank">crossbeats REV. | arcade-songs</a>',
      "<i>Such marvelous songs deserve to be preserved and remembered ...</i>",
    ],
  },
  {
    title: "2023/11/06 － v3.10.1 Update",
    variant: "minor",
    items: [
      "bugfix: (Grid View / Sheet Dialog) prevent displaying mismatched cover images when loading",
    ],
  },
  {
    title: "2023/10/06 － 200000 visits reached",
    variant: "milestone",
    items: [
      'milestone: 200000 visits reached on <a href="https://arcade-songs.zetaraku.dev/maimai/" target="_blank">arcade-songs/maimai</a>!',
    ],
  },
  {
    title: "2023/07/29 － 150000 visits reached",
    variant: "milestone",
    items: [
      'milestone: 150000 visits reached on <a href="https://arcade-songs.zetaraku.dev/maimai/" target="_blank">arcade-songs/maimai</a>!',
    ],
  },
  {
    title: "2023/07/20 － v3.10 Update",
    variant: "update",
    items: [
      "feature: add sheet information (Notes Designer, Note Counts) for <strong>CHUNITHM</strong>",
    ],
  },
  {
    title: "2023/07/09 － v3.9 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>ノスタルジア</strong> >> <a href="https://arcade-songs.zetaraku.dev/nostalgia/" target="_blank">ノスタルジア | arcade-songs</a>',
    ],
  },
  {
    title: "2023/07/03 － v3.8 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>DanceDanceRevolution</strong> >> <a href="https://arcade-songs.zetaraku.dev/ddr/" target="_blank">DanceDanceRevolution | arcade-songs</a>',
    ],
  },
  {
    title: "2023/04/08 － 100000 visits reached",
    variant: "milestone",
    items: [
      'milestone: 100000 visits reached on <a href="https://arcade-songs.zetaraku.dev/maimai/" target="_blank">arcade-songs/maimai</a>!',
    ],
  },
  {
    title: "2023/04/04 － v3.7 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>DANCERUSH STARDOM</strong> >> <a href="https://arcade-songs.zetaraku.dev/drs/" target="_blank">DANCERUSH STARDOM | arcade-songs</a>',
    ],
  },
  {
    title: "2023/03/07 － v3.6 Update",
    variant: "update",
    items: [
      "feature: (My List) add export preview for My List",
      "feature: (Gallery) add external gallery example in provider menu",
      "misc: (Site) track more interaction event for development insight >:)",
    ],
  },
  {
    title: "2023/03/02 － v3.5.2 Update",
    variant: "minor",
    items: [
      'i18n: (Site) Indonesian (id) locale is now available! <i>(Thanks <a href="https://github.com/echocentrical" target="_blank">@echocentrical</a> !)</i>',
    ],
  },
  {
    title: "2023/03/01 － v3.5.1 Update",
    variant: "minor",
    items: [
      'i18n: (Site) Spanish (es) locale is now available! <i>(Thanks <a href="https://github.com/gallegonovato" target="_blank">@gallegonovato</a> !)</i>',
    ],
  },
  {
    title: "2023/02/15 － v3.5 Update",
    variant: "update",
    items: [
      'feature: (Filter) add "Internal Level" filter',
      "misc!: (Data) now <code>levelValue</code> reflects the lower bound of its internal level (e.g. <code>levelValue</code> of level 12+ is <i>12.5</i> in CHUNITHM but <i>12.7</i> in maimai, オンゲキ and WACCA)",
      "misc!: (Data) unknown <code>internalLevelValue</code> is now inferred as the lowest possible value from its level (see above)",
      "misc: (Site) add sitemap",
    ],
  },
  {
    title: "2022/11/17 － v3.4 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>pop\'n music</strong> >> <a href="https://arcade-songs.zetaraku.dev/popn/" target="_blank">pop\'n music | arcade-songs</a>',
    ],
  },
  {
    title: "2022/11/02 － v3.3 Update",
    variant: "update",
    items: [
      'feature: (Gallery) now it\'s possible to load external gallery from url or local file [beta] 👉 <a href="https://arcade-songs.zetaraku.dev/maimai/gallery/?url=https%3A%2F%2Fgist.githubusercontent.com%2Fzetaraku%2Fc8a28b5bbd17cd421278ec45f4e4e953%2Fraw%2F" target="_blank"> DEMO HERE </a>',
    ],
  },
  {
    title: "2022/10/14 － 50000 visits reached",
    variant: "milestone",
    items: [
      'milestone: 50000 visits reached on <a href="https://arcade-songs.zetaraku.dev/maimai/" target="_blank">arcade-songs/maimai</a>!',
    ],
  },
  {
    title: "2022/09/23 － v3.2 Update",
    variant: "update",
    items: [
      "feature: (Gallery) now each list in gallery will have its respective url",
      "ui: (Gallery) list title is now shown and the size of section titles is adjusted",
    ],
  },
  {
    title: "2022/09/22 － v3.1 Update",
    variant: "update",
    items: [
      "feature: (Data) add sheet internal level information for <strong>オンゲキ</strong>",
      'Data source: <a class="text-decoration-none" href="https://twitter.com/ongeki_score" target="_blank"> <span>OngekiScoreLog - オンゲキ非公式スコアツール</span> </a> / <a href="https://ongeki-score.net/" target="_blank">OngekiScoreLog - オンゲキ非公式スコアツール</a> <i> (Thanks <a href="https://twitter.com/Rinsaku471" target="_blank">@Rinsaku471</a> & <a href="https://twitter.com/RKS49019722" target="_blank">@RKS49019722</a> & <a href="https://twitter.com/masa_9713" target="_blank">@masa_9713</a> & <a href="https://twitter.com/ongeki_score" target="_blank">@ongeki_score</a> !) </i>',
      "misc: (My List) preserve song id for unmatched imported sheets",
    ],
  },
  {
    title: "2022/08/02 － v3.0.1 Update",
    variant: "minor",
    items: [
      'i18n: (Site) Korean (ko) locale is now available! <i>(Thanks <a href="https://github.com/lomotos10" target="_blank">@lomotos10</a> !)</i>',
    ],
  },
  {
    title: "2022/07/28 － v3.0 Convergence",
    variant: "release",
    items: [
      '<i>"Search songs of your favorite music games, now all in one!"</i>',
      'project: each <strong>*-songs</strong> site is now moved under >> <a href="https://arcade-songs.zetaraku.dev/" target="_blank">arcade-songs.zetaraku.dev</a>',
      'project: this project is now open-source! ⭐ >> <a href="https://github.com/zetaraku/arcade-songs" target="_blank">zetaraku/arcade-songs</a>',
      "feature: (Sheet Drawer) brand new Sheet Combo Drawer is now available!",
      "misc!: (My List) the import/export feature for My List now uses a new format (.yaml)",
    ],
  },
  {
    title: "2022/07/08 － v2.15 Update",
    variant: "update",
    items: [
      "feature: (Data) add sheet internal level information for <strong>CHUNITHM</strong>",
      'Data source: <a class="text-decoration-none" href="https://twitter.com/RCMF_chunithm" target="_blank"> <span>CHUNITHM譜面定数メインフレーム</span> </a> / <a href="https://developer.chunirec.net/" target="_blank">chunirec 開発者向けサイト</a> <i>(Thanks <a href="https://twitter.com/RCMF_chunithm" target="_blank">@RCMF_chunithm</a> & <a href="https://twitter.com/chunirec" target="_blank">@chunirec</a> !)</i>',
      "feature: (Grid View) sorting is now available on Grid View too",
      "misc: (Grid View) cover images will not be displayed when drawing sheet combo",
    ],
  },
  {
    title: "2022/06/29 － v2.14.1 Update",
    variant: "minor",
    items: [
      "misc: (Data) adapt .webp format for cover images to speed up the loading time 🚅⚡",
    ],
  },
  {
    title: "2022/06/24 － 30000 visits reached",
    variant: "milestone",
    items: [
      'milestone: 30000 visits reached on <a href="https://maimai-songs.zetaraku.dev" target="_blank">maimai-songs</a>!',
    ],
  },
  {
    title: "2022/06/12 － v2.14 Update",
    variant: "update",
    items: [
      "feature: (Data) add sheet internal level information for <strong>maimai</strong>",
      'Data source: <a class="text-decoration-none" href="https://twitter.com/rcmf_maimai" target="_blank"> <span>maimai譜面定数メインフレーム</span> </a> <i>(Thanks <a href="https://twitter.com/rcmf_maimai" target="_blank">@RCMF_maimai</a> !)</i>',
      "misc: (Data) now each song will have an unique id",
    ],
  },
  {
    title: "2022/04/24 － v2.13 Update",
    variant: "update",
    items: [
      "feature: (Song List) add Song List page",
      "feature: (Song Page) add Song pages for each song",
      'misc: (Track List) rename "Gallery" as "Track List"',
      "misc: (Filter) buttons on app bar are now moved to side drawer",
      "misc: (Portal) Portal Dialog is now moved to a dedicated page",
    ],
  },
  {
    title: "2022/04/12 － v2.12 Update",
    variant: "update",
    items: [
      "misc: (Data) use new version of data source",
      "misc: (Data) display min/max bpm on filter placeholder",
    ],
  },
  {
    title: "2022/03/17 － 20000 visits reached",
    variant: "milestone",
    items: [
      'milestone: 20000 visits reached on <a href="https://maimai-songs.zetaraku.dev" target="_blank">maimai-songs</a>!',
    ],
  },
  {
    title: "2022/03/04 － v2.11.3 Update",
    variant: "minor",
    items: ["bugfix: (Data) chunithm data is now up to date"],
  },
  {
    title: "2022/02/14 － v2.11.2 Update",
    variant: "minor",
    items: [
      "ui: (Grid View / Gallery) adjust text alignment",
      "misc: (Site) improve loading speed",
    ],
  },
  {
    title: "2022/01/30 － v2.11.1 Update",
    variant: "minor",
    items: ["i18n: (Site) add zh-Hans (zh-CN) locale"],
  },
  {
    title: "2022/01/29 － v2.11 Update",
    variant: "update",
    items: [
      "feature: (Data) add song list info for China version (舞萌DX)",
      'feature: (Filter) region filter "China ver. (舞萌DX)" is now available',
      'Data source: <a class="text-decoration-none" href="https://github.com/CrazyKidCN/maimaiDX-CN-songs-database" target="_blank"> <span>CrazyKidCN/maimaiDX-CN-songs-database</span> </a> <i>(Thanks <a href="https://github.com/CrazyKidCN" target="_blank">@CrazyKidCN</a> !)</i>',
    ],
  },
  {
    title: "2022/01/17 － v2.10.1 Update",
    variant: "minor",
    items: [
      "misc: (Grid View) prevent sprite sheet image to be selected on mobile devices",
    ],
  },
  {
    title: "2022/01/11 － v2.10 Update",
    variant: "update",
    items: [
      "feature: (Random Set) now you can draw a set of sheets in Random Set mode!",
      "misc: (My List) use dummy sheets to represent unmatched sheets from importing",
      "misc: (Grid View) fix potential id duplication bug",
    ],
  },
  {
    title: "2022/01/05 － v2.9.1 Update",
    variant: "minor",
    items: [
      "misc: (Filter) filters of title and artist are now case-insensitive",
      "misc: (Filter) My List switch is now changed to radio",
      "misc: (Sheet Dialog) cover image of songs can now be easily saved",
      "misc: (Grid View) sheet grids should now perfectly aligned",
    ],
  },
  {
    title: "2021/09/29 － 10000 visits reached",
    variant: "milestone",
    items: [
      'milestone: 10000 visits reached on <a href="https://maimai-songs.zetaraku.dev" target="_blank">maimai-songs</a>!',
    ],
  },
  {
    title: "2021/09/21 － v2.9 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>Project DIVA Arcade</strong> >> <a href="https://diva-songs.zetaraku.dev/" target="_blank">diva-songs</a>',
    ],
  },
  {
    title: "2021/08/24 － v2.8.1 Update",
    variant: "minor",
    items: [
      "bugfix: (Data) handle null category (jubeat)",
      "misc: (Site) change main theme color for jubeat-songs and gc-songs",
    ],
  },
  {
    title: "2021/08/23 － v2.8 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>GROOVE COASTER</strong> >> <a href="https://gc-songs.zetaraku.dev/" target="_blank">gc-songs</a>',
    ],
  },
  {
    title: "2021/08/20 － v2.7.1 Update",
    variant: "minor",
    items: ["misc: (Site) change logo and favicons"],
  },
  {
    title: "2021/08/20 － v2.7 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>オンゲキ</strong> >> <a href="https://ongeki-songs.zetaraku.dev/" target="_blank">ongeki-songs</a>',
    ],
  },
  {
    title: "2021/08/20 － v2.6 Update",
    variant: "update",
    items: [
      'feature: (Song List) re-add "Gallery" as "Song List"',
      "feature: (My List) now you can import/export sheets in My List",
      "misc: (Data) maimai: region-only songs are manually added",
    ],
  },
  {
    title: "2021/06/21 － v2.5.5 Update",
    variant: "minor",
    items: [
      "ui: (List View / Sheet Dialog) now locked songs will have a locked icon",
    ],
  },
  {
    title: "2021/05/25 － v2.5.4 Update",
    variant: "minor",
    items: [
      "bugfix: (Grid View) scaling on hover now works on non-Firefox browsers too",
    ],
  },
  {
    title: "2021/05/16 － v2.5.3 Update",
    variant: "minor",
    items: [
      'project: update of <a href="https://sdvx-songs.zetaraku.dev" target="_blank">sdvx-songs</a> is now started again! :D',
      "misc: (Data) now songs can have multiple categories (used by <u>sdvx-songs</u>)",
      "misc: (Site) track more interaction event for development insight >:)",
    ],
  },
  {
    title: "2021/03/18 － v2.5.2 Update",
    variant: "minor",
    items: [
      "misc: (Filter) now display how many songs are included in the current selection",
      "bugfix: (Grid View) fix the excessive white border on the cover images",
    ],
  },
  {
    title: "2021/03/10 － v2.5.1 Update",
    variant: "minor",
    items: ["bugfix: (Grid View) fix the broken light bulb 💡 in DARK MODE"],
  },
  {
    title: "2021/02/03 － v2.5 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>太鼓の達人</strong> >> <a href="https://taiko-songs.zetaraku.dev" target="_blank">taiko-songs</a>',
    ],
  },
  {
    title: "2021/01/31 － v2.4 Update",
    variant: "update",
    items: [
      "feature: (Site / Filter) now you can copy and use a Filter Link",
      "feature: (Sheet Dialog) now you can click on the title to copy it",
      "ui: (Grid View) add second pagination",
      "misc: (Grid View) now the default sorting is ordered by version then release date",
    ],
  },
  {
    title: "2021/01/22 － v2.3 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>jubeat</strong> >> <a href="https://jubeat-songs.zetaraku.dev" target="_blank">jubeat-songs</a>',
    ],
  },
  {
    title: "2021/01/20 － v2.2 Update",
    variant: "release",
    items: [
      'project: add new site for <strong>SOUND VOLTEX</strong> >> <a href="https://sdvx-songs.zetaraku.dev" target="_blank">sdvx-songs</a>',
    ],
  },
  {
    title: "2021/01/15 － v2.1.1 Update",
    variant: "minor",
    items: [
      "ui: (Filter) make multiple selectable chips individually removable",
      "ui: (Filter) prevent comboboxes from being obstructed by the autocomplete list",
    ],
  },
  {
    title: "2021/01/11 － v2.1 Update",
    variant: "update",
    items: [
      'feature: (Data) add "WORLD\'S END" sheets for CHUNITHM',
      'feature: (Site) add "Portal"',
      'feature: (Site) remove "Gallery"',
      "ui: (Grid View) fix img tag display problem (extra space)",
    ],
  },
  {
    title: "2021/01/01 － v2.0.21 United",
    variant: "release",
    items: [
      "<i>HAPPY NEW YEAR <del>2020</del> 2021!</i>",
      'project: <u>mai-songs</u> is now moved to >> <a href="https://maimai-songs.zetaraku.dev" target="_blank">maimai-songs</a>',
      'project: add new site for <strong>WACCA</strong> >> <a href="https://wacca-songs.zetaraku.dev" target="_blank">wacca-songs</a>',
      'project: add new site for <strong>CHUNITHM</strong> >> <a href="https://chunithm-songs.zetaraku.dev" target="_blank">chunithm-songs</a>',
    ],
  },
  {
    title: "2020/12/31 － v1.9.9 Update",
    variant: "minor",
    items: [
      "ui: (Sheet Dialog) add release date and version info",
      "misc: (Site) add Open Graph meta tags for social media preview",
      "misc: (Data) enable asset compression",
    ],
  },
  {
    title: "2020/11/06 － v1.4 Update",
    variant: "mystery",
    items: [
      "feature: (???) <strong><i>HOLD ON!</i></strong> A mysterious <strong>singing slate</strong> is said to exist, but <i>where is it?</i>",
      "ui: (Gallery) add Sheet Dialog support for Gallery",
      "misc: (About Page) add timeline for Update Record",
    ],
  },
  {
    title: "2020/10/31 － v1.3 Update",
    variant: "update",
    items: ['feature: (Gallery) add "Gallery"'],
  },
  {
    title: "2020/10/22 － v1.2.2 Update",
    variant: "minor",
    items: [
      "ui: (Filter) add icons to texts of different modes",
      "ui: (Grid View) add shadow, title tooltips and image scaling on mouse hover",
    ],
  },
  {
    title: "2020/10/20 － v1.2.1 Update",
    variant: "minor",
    items: [
      "ui: (Sheet Dialog) add tooltips for long truncated song titles",
      "ui: (Grid View) change sheets-per-page to 48 for a nicer look",
      "ui: (Grid View) ensure grid width fitting well with long level strings",
      "bugfix: (Grid View) now current page correctly reset when filters change",
      "misc: (Site) apply dynamic page title",
    ],
  },
  {
    title: "2020/10/16 － v1.2 Update",
    variant: "update",
    items: [
      "feature: (Grid View) add Grid View",
      "ui: (Sheet Dialog) add sheet type icons",
    ],
  },
  {
    title: "2020/10/06 － v1.1.1 Update",
    variant: "minor",
    items: [
      "bugfix: (Data) 28 missing sheets re-added",
      "bugfix: (Filter) now clearing BPM results a correct behavior",
      "ui: (List View) apply difficulty colors",
    ],
  },
  {
    title: "2020/09/18 － v1.1 Update",
    variant: "update",
    items: [
      'feature: (List View) add "Open Sheet Dialog" button',
      'feature: (Sheet Dialog) add "Search on YouTube" button',
    ],
  },
  {
    title: "2020/08/16 － v1.0 Release",
    variant: "milestone",
    items: [
      'feature: (Filter) add "Region" filter',
      'feature: (Filter) add "BPM" filter',
    ],
  },
  {
    title: "2020/07/30 － v0.1 Beta Test",
    variant: "update",
    items: ["<i>Tester 001: Glad to see you like it.</i>"],
  },
  {
    title: "2020/07/27 － v0.0.1 Project Started",
    variant: "update",
    items: ["<i>This project was devoted to my friends ...</i>"],
  },
] as const;

const markerClasses = {
  update: "bg-[var(--theme-color)]",
  release: "bg-blue-500 ring-4 ring-blue-500/20",
  milestone: "bg-amber-500 ring-4 ring-amber-500/20",
  mystery: "bg-orange-400 ring-4 ring-orange-400/25",
  minor: "h-2.5 w-2.5 bg-gray-400",
} as const;

export function ChangelogTimeline() {
  return (
    <div className="relative space-y-5 pl-7 before:absolute before:bottom-0 before:left-2 before:top-0 before:w-px before:bg-[var(--border)]">
      {updates.map((update, index) => (
        <article key={`${update.title}-${index}`} className="relative">
          <span
            className={`absolute -left-[1.55rem] top-1 h-3 w-3 rounded-full ${markerClasses[update.variant]}`}
          />
          <h4 className="font-bold">{update.title}</h4>
          <ul className="list-disc pl-5 text-sm opacity-90">
            {update.items.map((item, itemIndex) => (
              <li
                key={`${update.title}-${itemIndex}`}
                dangerouslySetInnerHTML={{ __html: item }}
              />
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
