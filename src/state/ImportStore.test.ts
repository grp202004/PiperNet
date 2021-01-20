import ImportStore from "./ImportStore";
fs = require('fs');


const store = new ImportStore()

const blob = new Blob([
            "source,target,value\rNapoleon,Myriel,1\rMlle.Baptistine,Myriel,8\rMme.Magloire,Myriel,10\rMme.Magloire,Mlle.Baptistine,6\rCountessdeLo,Myriel,1\rGeborand,Myriel,1\rChamptercier,Myriel,1\rCravatte,Myriel,1\rCount,Myriel,2\rOldMan,Myriel,1\rValjean,Labarre,1\rValjean,Mme.Magloire,3\rValjean,Mlle.Baptistine,3\rValjean,Myriel,5\rMarguerite,Valjean,1\rMme.deR,Valjean,1\rIsabeau,Valjean,1\rGervais,Valjean,1\rListolier,Tholomyes,4\rFameuil,Tholomyes,4\rFameuil,Listolier,4\rBlacheville,Tholomyes,4\rBlacheville,Listolier,4\rBlacheville,Fameuil,4\rFavourite,Tholomyes,3\rFavourite,Listolier,3\rFavourite,Fameuil,3\rFavourite,Blacheville,4\rDahlia,Tholomyes,3\rDahlia,Listolier,3\rDahlia,Fameuil,3\rDahlia,Blacheville,3\rDahlia,Favourite,5\rZephine,Tholomyes,3\rZephine,Listolier,3\rZephine,Fameuil,3\rZephine,Blacheville,3\rZephine,Favourite,4\rZephine,Dahlia,4\rFantine,Tholomyes,3\rFantine,Listolier,3\rFantine,Fameuil,3\rFantine,Blacheville,3\rFantine,Favourite,4\rFantine,Dahlia,4\rFantine,Zephine,4\rFantine,Marguerite,2\rFantine,Valjean,9\rMme.Thenardier,Fantine,2\rMme.Thenardier,Valjean,7\rThenardier,Mme.Thenardier,13\rThenardier,Fantine,1\rThenardier,Valjean,12\rCosette,Mme.Thenardier,4\rCosette,Valjean,31\rCosette,Tholomyes,1\rCosette,Thenardier,1\rJavert,Valjean,17\rJavert,Fantine,5\rJavert,Thenardier,5\rJavert,Mme.Thenardier,1\rJavert,Cosette,1\rFauchelevent,Valjean,8\rFauchelevent,Javert,1\rBamatabois,Fantine,1\rBamatabois,Javert,1\rBamatabois,Valjean,2\rPerpetue,Fantine,1\rSimplice,Perpetue,2\rSimplice,Valjean,3\rSimplice,Fantine,2\rSimplice,Javert,1\rScaufflaire,Valjean,1\rWoman1,Valjean,2\rWoman1,Javert,1\rJudge,Valjean,3\rJudge,Bamatabois,2\rChampmathieu,Valjean,3\rChampmathieu,Judge,3\rChampmathieu,Bamatabois,2\rBrevet,Judge,2\rBrevet,Champmathieu,2\rBrevet,Valjean,2\rBrevet,Bamatabois,1\rChenildieu,Judge,2\rChenildieu,Champmathieu,2\rChenildieu,Brevet,2\rChenildieu,Valjean,2\rChenildieu,Bamatabois,1\rCochepaille,Judge,2\rCochepaille,Champmathieu,2\rCochepaille,Brevet,2\rCochepaille,Chenildieu,2\rCochepaille,Valjean,2\rCochepaille,Bamatabois,1\rPontmercy,Thenardier,1\rBoulatruelle,Thenardier,1\rEponine,Mme.Thenardier,2\rEponine,Thenardier,3\rAnzelma,Eponine,2\rAnzelma,Thenardier,2\rAnzelma,Mme.Thenardier,1\rWoman2,Valjean,3\rWoman2,Cosette,1\rWoman2,Javert,1\rMotherInnocent,Fauchelevent,3\rMotherInnocent,Valjean,1\rGribier,Fauchelevent,2\rMme.Burgon,Jondrette,1\rGavroche,Mme.Burgon,2\rGavroche,Thenardier,1\rGavroche,Javert,1\rGavroche,Valjean,1\rGillenormand,Cosette,3\rGillenormand,Valjean,2\rMagnon,Gillenormand,1\rMagnon,Mme.Thenardier,1\rMlle.Gillenormand,Gillenormand,9\rMlle.Gillenormand,Cosette,2\rMlle.Gillenormand,Valjean,2\rMme.Pontmercy,Mlle.Gillenormand,1\rMme.Pontmercy,Pontmercy,1\rMlle.Vaubois,Mlle.Gillenormand,1\rLt.Gillenormand,Mlle.Gillenormand,2\rLt.Gillenormand,Gillenormand,1\rLt.Gillenormand,Cosette,1\rMarius,Mlle.Gillenormand,6\rMarius,Gillenormand,12\rMarius,Pontmercy,1\rMarius,Lt.Gillenormand,1\rMarius,Cosette,21\rMarius,Valjean,19\rMarius,Tholomyes,1\rMarius,Thenardier,2\rMarius,Eponine,5\rMarius,Gavroche,4\rBaronessT,Gillenormand,1\rBaronessT,Marius,1\rMabeuf,Marius,1\rMabeuf,Eponine,1\rMabeuf,Gavroche,1\rEnjolras,Marius,7\rEnjolras,Gavroche,7\rEnjolras,Javert,6\rEnjolras,Mabeuf,1\rEnjolras,Valjean,4\rCombeferre,Enjolras,15\rCombeferre,Marius,5\rCombeferre,Gavroche,6\rCombeferre,Mabeuf,2\rProuvaire,Gavroche,1\rProuvaire,Enjolras,4\rProuvaire,Combeferre,2\rFeuilly,Gavroche,2\rFeuilly,Enjolras,6\rFeuilly,Prouvaire,2\rFeuilly,Combeferre,5\rFeuilly,Mabeuf,1\rFeuilly,Marius,1\rCourfeyrac,Marius,9\rCourfeyrac,Enjolras,17\rCourfeyrac,Combeferre,13\rCourfeyrac,Gavroche,7\rCourfeyrac,Mabeuf,2\rCourfeyrac,Eponine,1\rCourfeyrac,Feuilly,6\rCourfeyrac,Prouvaire,3\rBahorel,Combeferre,5\rBahorel,Gavroche,5\rBahorel,Courfeyrac,6\rBahorel,Mabeuf,2\rBahorel,Enjolras,4\rBahorel,Feuilly,3\rBahorel,Prouvaire,2\rBahorel,Marius,1\rBossuet,Marius,5\rBossuet,Courfeyrac,12\rBossuet,Gavroche,5\rBossuet,Bahorel,4\rBossuet,Enjolras,10\rBossuet,Feuilly,6\rBossuet,Prouvaire,2\rBossuet,Combeferre,9\rBossuet,Mabeuf,1\rBossuet,Valjean,1\rJoly,Bahorel,5\rJoly,Bossuet,7\rJoly,Gavroche,3\rJoly,Courfeyrac,5\rJoly,Enjolras,5\rJoly,Feuilly,5\rJoly,Prouvaire,2\rJoly,Combeferre,5\rJoly,Mabeuf,1\rJoly,Marius,2\rGrantaire,Bossuet,3\rGrantaire,Enjolras,3\rGrantaire,Combeferre,1\rGrantaire,Courfeyrac,2\rGrantaire,Joly,2\rGrantaire,Gavroche,1\rGrantaire,Bahorel,1\rGrantaire,Feuilly,1\rGrantaire,Prouvaire,1\rMotherPlutarch,Mabeuf,3\rGueulemer,Thenardier,5\rGueulemer,Valjean,1\rGueulemer,Mme.Thenardier,1\rGueulemer,Javert,1\rGueulemer,Gavroche,1\rGueulemer,Eponine,1\rBabet,Thenardier,6\rBabet,Gueulemer,6\rBabet,Valjean,1\rBabet,Mme.Thenardier,1\rBabet,Javert,2\rBabet,Gavroche,1\rBabet,Eponine,1\rClaquesous,Thenardier,4\rClaquesous,Babet,4\rClaquesous,Gueulemer,4\rClaquesous,Valjean,1\rClaquesous,Mme.Thenardier,1\rClaquesous,Javert,1\rClaquesous,Eponine,1\rClaquesous,Enjolras,1\rMontparnasse,Javert,1\rMontparnasse,Babet,2\rMontparnasse,Gueulemer,2\rMontparnasse,Claquesous,2\rMontparnasse,Valjean,1\rMontparnasse,Gavroche,1\rMontparnasse,Eponine,1\rMontparnasse,Thenardier,1\rToussaint,Cosette,2\rToussaint,Javert,1\rToussaint,Valjean,1\rChild1,Gavroche,2\rChild2,Gavroche,2\rChild2,Child1,3\rBrujon,Babet,3\rBrujon,Gueulemer,3\rBrujon,Thenardier,3\rBrujon,Gavroche,1\rBrujon,Eponine,1\rBrujon,Claquesous,1\rBrujon,Montparnasse,1\rMme.Hucheloup,Bossuet,1\rMme.Hucheloup,Joly,1\rMme.Hucheloup,Grantaire,1\rMme.Hucheloup,Bahorel,1\rMme.Hucheloup,Courfeyrac,1\rMme.Hucheloup,Gavroche,1\rMme.Hucheloup,Enjolras,1",
,
],
    {
        type:
            "text/csv",
    })







// const data = fs.readFileSync('E:/grp/new/PiperNet-GraphGeneration/src/samples/lesmiserables-edges.csv', 'utf-8');

// const fileObjectTest = new File([data], 'E:/grp/new/PiperNet-GraphGeneration/src/samples/lesmiserables-edges.csv', { type: blob.type })
//const fileObjectTest = new URL('file:///E:/grp/new/PiperNet-GraphGeneration/src/samples/lesmiserables-edges.csv')
//const file = new File([blob], 'untitled', { type: blob.type })


const headTest = false

const delimiter = ","

test('ttt', () => {

    store.readCSV(blob, headTest, delimiter)

    console.log("3")

})