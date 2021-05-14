const connection = require('../database/connection');
const jwt = require('../functions/jwt');

module.exports = {
    async getNomeGranja(request, response) {
        const { id } = jwt.decodeJWTToken(request.headers.authorization);

        var granja = await connection('granjas').select('razaoSocial').where('id', id).first();
        granja ? null : granja = await connection('granjas_fisicas').select('nome').where('id', id).first();

        return response.json(granja);
    },
    async getGranjaData(request, response) {
        const { id } = jwt.decodeJWTToken(request.headers.authorization);

        const granjaJuridica = await connection('granjas').select('nomeFantasia', 'razaoSocial',
            'cnpj', 'email', 'proprietario', 'gaiola', 'localizacao').where('id', id).first();

        if (granjaJuridica) {
            return response.json({
                granjaJuridica,
                type: true
            })
        }

        const granjaFisica = await connection('granjas_fisicas').select('nome',
            'cpf', 'email', 'proprietario', 'gaiola', 'localizacao').where('id', id).first();

        return response.json({ granja, type: false });
    },
    async updateGranja(request, response) {
        try {
            const { isGranjaJuridica } = request.params;
            const data = request.body;
            const { id } = jwt.decodeJWTToken(request.headers.authorization);

            if (isGranjaJuridica) {
                await connection('granjas').update(data).where('id', id);
            } else {
                console.log("passei aqui")
                await connection('granjas_fisicas').update(data).where('id', id);
            }

            return response.status(200).send();
        } catch (error) {
            return response.status(400).json(error);
        }
    }
}