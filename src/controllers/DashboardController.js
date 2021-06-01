const Knex = require('knex');
const connection = require('../database/connection');
const jwt = require('../functions/jwt');

module.exports = {
    async statusRow(request, response) {
        const { id } = jwt.decodeJWTToken(request.headers.authorization);
        const statusRowData = [];
        const ovo = await connection('ovos').where('granja_id', id).first();
        const lote = await connection('lotes').where('granja_id', id).first();

        if (ovo && lote) {
            const ovos = await connection('ovos').count('id').where('granja_id', id).first();
            ovos ? statusRowData.push({ value: ovos['count(`id`)'], unit: "", text: "Ovos inseridos" }) : null;

            const loteModa = await connection('ovos').select('lote').groupBy('lote').orderBy(connection('ovos').count('*').first(), 'desc').limit(1).first();
            loteModa ? statusRowData.push({ value: loteModa.lote, unit: "", text: "Lote com mais ovos" }) : null;

            const avgPesoOvo = await connection('ovos').avg('pesoOvo').where('granja_id', id).first();
            avgPesoOvo ? statusRowData.push({ value: avgPesoOvo['avg(`pesoOvo`)'], unit: "g", text: "Peso médio" }) : null;

            const avgCorCasca = await connection('ovos').avg('corCasca').where('granja_id', id).first();
            avgCorCasca ? statusRowData.push({ value: avgCorCasca['avg(`corCasca`)'], unit: "", text: "Cor média das Cascas" }) : null;

            const avgCorGema = await connection('ovos').avg('corGema').where('granja_id', id).first();
            avgCorGema ? statusRowData.push({ value: avgCorGema['avg(`corGema`)'], unit: "", text: "Cor média das Gema" }) : null;
        }
        return response.json(statusRowData);
    },
    async chartData(request, response) {
        const { id } = jwt.decodeJWTToken(request.headers.authorization);
        const { eggColumn, dateType } = request.body;
        const chartRowData = [];
        const lote = await connection('lotes').where('granja_id', id).first();

        if (!lote) {
            return response.json({ error: "Nenhum ovo foi inserido até o momento." })
        }
        if (dateType == "week") {
            var date = new Date();
            date.setDate(date.getDate() - 7);

            for (let i = 0; i <= 8; i++) {
                var avgDay = 0;
                const year = date.getFullYear();
                const month = date.getMonth() <= 8 ? '0' + (date.getMonth() + 1).toString() : date.getMonth() + 1
                const day = date.getDate() <= 9 ? '0' + date.getDate().toString() : date.getDate();
                const dateFormated = `${year}-${month}-${day}`;
                const dateChart = `${day}/${month}/${year}`;
                const secoes = await connection.raw(`select * from secao_ovo where strftime('%Y-%m-%d',created_at) = strftime('%Y-%m-%d','${dateFormated}')`);

                if (secoes.length !== 0) {
                    const promise = await Promise.all(
                        secoes.map(async ({ id }) => {
                            const avgLocal = await connection('ovos').avg({ total: eggColumn }).where('secao_id', id).first();
                            avgDay += avgLocal["total"];
                        })
                    )
                    chartRowData.push({ dateChart, avg: avgDay });
                }
                date.setDate(date.getDate() + 1);
            }
        } else if (dateType == "year") {
            var date = new Date();
            const currentMonth = date.getMonth();
            const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
            date.setMonth(0);

            for (let j = 0; j <= currentMonth; j++) {
                var avgMonth = 0;
                const year = date.getFullYear();
                const month = date.getMonth() <= 8 ? '0' + (date.getMonth() + 1).toString() : date.getMonth() + 1
                const day = date.getDate() <= 9 ? '0' + date.getDate().toString() : date.getDate();
                const dateFormated = `${year}-${month}-${day}`;
                const dateChart = `${meses[date.getMonth()]} ${year}`;
                const secoes = await connection.raw(`select id from secao_ovo where strftime('%Y-%m',created_at) = strftime('%Y-%m','${dateFormated}')`);

                if (secoes.length !== 0) {
                    const promise = await Promise.all(
                        secoes.map(async ({ id }) => {
                            const avgLocal = await connection('ovos').avg({ total: eggColumn }).where('secao_id', id).first();
                            avgMonth += avgLocal["total"];
                        })
                    )
                    chartRowData.push({ dateChart, avg: avgMonth });
                }
                date.setMonth(date.getMonth() + 1);
            }
        }

        return response.json({ chartRowData, dateType });

    },
    async populateSelect(request, response) {
        const keys = [
            { column: "pesoOvo", name: "Peso do ovo" },
            { column: "pesoCasca", name: "Peso da casca" },
            { column: "corCasca", name: "Cor da casca" },
            { column: "alturaAlbumen", name: "Altura do albúmen" },
            { column: "diametroAlbumen", name: "Diâmetro do albúmen" },
            { column: "pesoGema", name: "Peso da gema" },
            { column: "alturaGema", name: "Altura da gema" },
            { column: "diametroGema", name: "Diâmetro da gema" },
            { column: "corGema", name: "Cor da gema" },
        ]

        return response.json(keys);
    }
}