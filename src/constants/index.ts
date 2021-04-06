import convert from "xml-js";

export const GITHUB_URL = "";

export const SAMPLE_GRAPH_SNAPSHOTS = [
    [
        "Les Miserables",
        "source,target,value\rNapoleon,Myriel,1\rMlle.Baptistine,Myriel,8\rMme.Magloire,Myriel,10\rMme.Magloire,Mlle.Baptistine,6\rCountessdeLo,Myriel,1\rGeborand,Myriel,1\rChamptercier,Myriel,1\rCravatte,Myriel,1\rCount,Myriel,2\rOldMan,Myriel,1\rValjean,Labarre,1\rValjean,Mme.Magloire,3\rValjean,Mlle.Baptistine,3\rValjean,Myriel,5\rMarguerite,Valjean,1\rMme.deR,Valjean,1\rIsabeau,Valjean,1\rGervais,Valjean,1\rListolier,Tholomyes,4\rFameuil,Tholomyes,4\rFameuil,Listolier,4\rBlacheville,Tholomyes,4\rBlacheville,Listolier,4\rBlacheville,Fameuil,4\rFavourite,Tholomyes,3\rFavourite,Listolier,3\rFavourite,Fameuil,3\rFavourite,Blacheville,4\rDahlia,Tholomyes,3\rDahlia,Listolier,3\rDahlia,Fameuil,3\rDahlia,Blacheville,3\rDahlia,Favourite,5\rZephine,Tholomyes,3\rZephine,Listolier,3\rZephine,Fameuil,3\rZephine,Blacheville,3\rZephine,Favourite,4\rZephine,Dahlia,4\rFantine,Tholomyes,3\rFantine,Listolier,3\rFantine,Fameuil,3\rFantine,Blacheville,3\rFantine,Favourite,4\rFantine,Dahlia,4\rFantine,Zephine,4\rFantine,Marguerite,2\rFantine,Valjean,9\rMme.Thenardier,Fantine,2\rMme.Thenardier,Valjean,7\rThenardier,Mme.Thenardier,13\rThenardier,Fantine,1\rThenardier,Valjean,12\rCosette,Mme.Thenardier,4\rCosette,Valjean,31\rCosette,Tholomyes,1\rCosette,Thenardier,1\rJavert,Valjean,17\rJavert,Fantine,5\rJavert,Thenardier,5\rJavert,Mme.Thenardier,1\rJavert,Cosette,1\rFauchelevent,Valjean,8\rFauchelevent,Javert,1\rBamatabois,Fantine,1\rBamatabois,Javert,1\rBamatabois,Valjean,2\rPerpetue,Fantine,1\rSimplice,Perpetue,2\rSimplice,Valjean,3\rSimplice,Fantine,2\rSimplice,Javert,1\rScaufflaire,Valjean,1\rWoman1,Valjean,2\rWoman1,Javert,1\rJudge,Valjean,3\rJudge,Bamatabois,2\rChampmathieu,Valjean,3\rChampmathieu,Judge,3\rChampmathieu,Bamatabois,2\rBrevet,Judge,2\rBrevet,Champmathieu,2\rBrevet,Valjean,2\rBrevet,Bamatabois,1\rChenildieu,Judge,2\rChenildieu,Champmathieu,2\rChenildieu,Brevet,2\rChenildieu,Valjean,2\rChenildieu,Bamatabois,1\rCochepaille,Judge,2\rCochepaille,Champmathieu,2\rCochepaille,Brevet,2\rCochepaille,Chenildieu,2\rCochepaille,Valjean,2\rCochepaille,Bamatabois,1\rPontmercy,Thenardier,1\rBoulatruelle,Thenardier,1\rEponine,Mme.Thenardier,2\rEponine,Thenardier,3\rAnzelma,Eponine,2\rAnzelma,Thenardier,2\rAnzelma,Mme.Thenardier,1\rWoman2,Valjean,3\rWoman2,Cosette,1\rWoman2,Javert,1\rMotherInnocent,Fauchelevent,3\rMotherInnocent,Valjean,1\rGribier,Fauchelevent,2\rMme.Burgon,Jondrette,1\rGavroche,Mme.Burgon,2\rGavroche,Thenardier,1\rGavroche,Javert,1\rGavroche,Valjean,1\rGillenormand,Cosette,3\rGillenormand,Valjean,2\rMagnon,Gillenormand,1\rMagnon,Mme.Thenardier,1\rMlle.Gillenormand,Gillenormand,9\rMlle.Gillenormand,Cosette,2\rMlle.Gillenormand,Valjean,2\rMme.Pontmercy,Mlle.Gillenormand,1\rMme.Pontmercy,Pontmercy,1\rMlle.Vaubois,Mlle.Gillenormand,1\rLt.Gillenormand,Mlle.Gillenormand,2\rLt.Gillenormand,Gillenormand,1\rLt.Gillenormand,Cosette,1\rMarius,Mlle.Gillenormand,6\rMarius,Gillenormand,12\rMarius,Pontmercy,1\rMarius,Lt.Gillenormand,1\rMarius,Cosette,21\rMarius,Valjean,19\rMarius,Tholomyes,1\rMarius,Thenardier,2\rMarius,Eponine,5\rMarius,Gavroche,4\rBaronessT,Gillenormand,1\rBaronessT,Marius,1\rMabeuf,Marius,1\rMabeuf,Eponine,1\rMabeuf,Gavroche,1\rEnjolras,Marius,7\rEnjolras,Gavroche,7\rEnjolras,Javert,6\rEnjolras,Mabeuf,1\rEnjolras,Valjean,4\rCombeferre,Enjolras,15\rCombeferre,Marius,5\rCombeferre,Gavroche,6\rCombeferre,Mabeuf,2\rProuvaire,Gavroche,1\rProuvaire,Enjolras,4\rProuvaire,Combeferre,2\rFeuilly,Gavroche,2\rFeuilly,Enjolras,6\rFeuilly,Prouvaire,2\rFeuilly,Combeferre,5\rFeuilly,Mabeuf,1\rFeuilly,Marius,1\rCourfeyrac,Marius,9\rCourfeyrac,Enjolras,17\rCourfeyrac,Combeferre,13\rCourfeyrac,Gavroche,7\rCourfeyrac,Mabeuf,2\rCourfeyrac,Eponine,1\rCourfeyrac,Feuilly,6\rCourfeyrac,Prouvaire,3\rBahorel,Combeferre,5\rBahorel,Gavroche,5\rBahorel,Courfeyrac,6\rBahorel,Mabeuf,2\rBahorel,Enjolras,4\rBahorel,Feuilly,3\rBahorel,Prouvaire,2\rBahorel,Marius,1\rBossuet,Marius,5\rBossuet,Courfeyrac,12\rBossuet,Gavroche,5\rBossuet,Bahorel,4\rBossuet,Enjolras,10\rBossuet,Feuilly,6\rBossuet,Prouvaire,2\rBossuet,Combeferre,9\rBossuet,Mabeuf,1\rBossuet,Valjean,1\rJoly,Bahorel,5\rJoly,Bossuet,7\rJoly,Gavroche,3\rJoly,Courfeyrac,5\rJoly,Enjolras,5\rJoly,Feuilly,5\rJoly,Prouvaire,2\rJoly,Combeferre,5\rJoly,Mabeuf,1\rJoly,Marius,2\rGrantaire,Bossuet,3\rGrantaire,Enjolras,3\rGrantaire,Combeferre,1\rGrantaire,Courfeyrac,2\rGrantaire,Joly,2\rGrantaire,Gavroche,1\rGrantaire,Bahorel,1\rGrantaire,Feuilly,1\rGrantaire,Prouvaire,1\rMotherPlutarch,Mabeuf,3\rGueulemer,Thenardier,5\rGueulemer,Valjean,1\rGueulemer,Mme.Thenardier,1\rGueulemer,Javert,1\rGueulemer,Gavroche,1\rGueulemer,Eponine,1\rBabet,Thenardier,6\rBabet,Gueulemer,6\rBabet,Valjean,1\rBabet,Mme.Thenardier,1\rBabet,Javert,2\rBabet,Gavroche,1\rBabet,Eponine,1\rClaquesous,Thenardier,4\rClaquesous,Babet,4\rClaquesous,Gueulemer,4\rClaquesous,Valjean,1\rClaquesous,Mme.Thenardier,1\rClaquesous,Javert,1\rClaquesous,Eponine,1\rClaquesous,Enjolras,1\rMontparnasse,Javert,1\rMontparnasse,Babet,2\rMontparnasse,Gueulemer,2\rMontparnasse,Claquesous,2\rMontparnasse,Valjean,1\rMontparnasse,Gavroche,1\rMontparnasse,Eponine,1\rMontparnasse,Thenardier,1\rToussaint,Cosette,2\rToussaint,Javert,1\rToussaint,Valjean,1\rChild1,Gavroche,2\rChild2,Gavroche,2\rChild2,Child1,3\rBrujon,Babet,3\rBrujon,Gueulemer,3\rBrujon,Thenardier,3\rBrujon,Gavroche,1\rBrujon,Eponine,1\rBrujon,Claquesous,1\rBrujon,Montparnasse,1\rMme.Hucheloup,Bossuet,1\rMme.Hucheloup,Joly,1\rMme.Hucheloup,Grantaire,1\rMme.Hucheloup,Bahorel,1\rMme.Hucheloup,Courfeyrac,1\rMme.Hucheloup,Gavroche,1\rMme.Hucheloup,Enjolras,1",
    ],
    ["COVID-19 Citation Graph 06-02", "../samples/json/a.json"],
];

export async function fetchSampleGraph(url: string) {
    try {
        let response = await fetch(url, { mode: "no-cors" });
        let gexfJson = await response.json();
        return new File([convert.json2xml(gexfJson)], "sample.gexf", {
            type: "text/xml",
        });
    } catch (error) {
        console.log(error);
    }
}

export const NAVBAR_HEIGHT = 50;

export const NODE_AND_EDGE_FILE = "import both nodes and edges file";
export const ONLY_EDGE_FILE = "only import edges file";

export const COLOR_LIST = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32,
};
