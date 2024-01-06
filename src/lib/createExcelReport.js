import writeXlsxFile from "write-excel-file";

function getCorrelationResult(correlation) {
    if (correlation <= 0.2)
    return 'Madde çok zayıf, testten çıkarılmalı'
    else if (correlation <= 0.3)
    return 'Madde düzeltildikten sonra teste alınmalı'
    else if (correlation <= 0.4)
    return 'Madde ayırt ediciliği iyi'
    else if (correlation <= 1)
    return 'Madde ayırt ediciliği mükemmel'
}

function getDifficulty(correctPossibility) {
    if (correctPossibility <= 0.2)
    return 'Çok zor'
    else if (correctPossibility <= 0.4)
    return 'Zor'
    else if (correctPossibility <= 0.6)
    return 'Orta güçlük'
    else if (correctPossibility <= 0.8)
    return 'Kolay'
    else if (correctPossibility <= 1)
    return 'Çok kolay'
}

const schema = [
    // Column #1
    {
    column: 'Madde Numarası',
    type: Number,
    align: "left",
    width:16,
    value: q => q.no
    },
    // Column #2
    {
    column: 'Madde Türü',
    type: String,
    width:16,
    value: () => "Çoktan Seçmeli"
    },
    // Column #3
    {
    column: 'Taksonomi',
    type: String,
    width:18,
    value: () => "-"
    },
    // Column #4
    {
    column: 'Madde Güçlüğü',
    type: Number,
    align: "center",
    width:16,
    value: q => q.correctPossibility
    },
    // Column #5
    {
    column: 'Madde Güçlük Durumu',
    type: String,
    align: "center",
    width:22,
    value: q => getDifficulty(q.correctPossibility)
    },
    // Column #6
    {
    column: 'Madde Ayırt Ediciliği',
    type: Number,
    align: "center",
    width:20,
    value: q => isNaN(q.correlation) ? 999 : q.correlation
    },
    // Column #7
    {
    column: 'Madde Ayırt Edicilik Durumu',
    type: String,
    align: "center",
    width:35,
    value: q => getCorrelationResult(q.correlation) ? getCorrelationResult(q.correlation) : '-'
    },
    // Column #8
    {
    column: 'A_f',
    type: Number,
    align: "center",
    value: q => q.opfreq.a
    },
    // Column #9
    {
    column: 'A_y',
    type: Number,
    align: "center",
    value: q => Math.round((q.opfreq.a / q.opfreq.total) * 10000) / 100
    },
    // Column #10
    {
    column: 'B_f',
    type: Number,
    align: "center",
    value: q => q.opfreq.b
    },
    // Column #11
    {
    column: 'B_y',
    type: Number,
    align: "center",
    value: q => Math.round((q.opfreq.b / q.opfreq.total) * 10000) / 100
    },
    // Column #12
    {
    column: 'C_f',
    type: Number,
    align: "center",
    value: q => q.opfreq.c
    },
    // Column #13
    {
    column: 'C_y',
    type: Number,
    align: "center",
    value: q => Math.round((q.opfreq.c / q.opfreq.total) * 10000) / 100
    },
    // Column #14
    {
    column: 'D_f',
    type: Number,
    align: "center",
    value: q => q.opfreq.d
    },
    // Column #15
    {
    column: 'D_y',
    type: Number,
    align: "center",
    value: q => Math.round((q.opfreq.d / q.opfreq.total) * 10000) / 100
    },
    // Column #16
    {
    column: 'E_f',
    type: Number,
    align: "center",
    value: q => q.opfreq.e
    },
    // Column #17
    {
    column: 'E_y',
    type: Number,
    align: "center",
    value: q => Math.round((q.opfreq.e / q.opfreq.total) * 10000) / 100
    },
    // Column #18
    {
    column: 'A_a_e',
    type: Number,
    align: "center",
    value: q => q.optionsDistinctiveness.a
    },
    // Column #19
    {
    column: 'B_a_e',
    type: Number,
    align: "center",
    value: q => q.optionsDistinctiveness.b
    },
    // Column #20
    {
    column: 'C_a_e',
    type: Number,
    align: "center",
    value: q => q.optionsDistinctiveness.c
    },
    // Column #21
    {
    column: 'D_a_e',
    type: Number,
    align: "center",
    value: q => q.optionsDistinctiveness.d
    },
    // Column #22
    {
    column: 'E_a_e',
    type: Number,
    align: "center",
    value: q => q.optionsDistinctiveness.e
    }
]

function makeObjectForExcel(data){
    let arr = [];
    let schemas = [];
    let sheets = [];
    data.map(u => {
    arr.push(u.questions);
    schemas.push(schema);
    sheets.push("Form"+u.kitapcik);
    });
    const ObjectForExcel = {
    arr,
    schemas,
    sheets
    };
    return ObjectForExcel;
}

export default async function downloadExcel(dataforExcel, fileNameState){
    const {arr, schemas, sheets} = makeObjectForExcel(dataforExcel)
    await writeXlsxFile(arr, {
    schema: schemas,
    sheets: sheets,
    headerStyle: {
        backgroundColor: '#245069',
        fontWeight: 'bold',
        color:"#FFFFFF"
    },
    fileName: `${fileNameState} - Rapor.xlsx`
    })
}