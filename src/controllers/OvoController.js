const connection = require('../database/connection');
const jwt =require('../functions/jwt');

module.exports = {
    async create(request, response) {
      const { id, lote, secao_id, pesoOvo, alturaAlbumen, diametroAlbumen, albumenEmpty} = request.body;
      const jwtToken = jwt.decodeJWTToken(request.headers.authorization);

      await connection('ovos').insert({
        id,
        lote,
        pesoOvo,
        secao_id,
        albumenEmpty,
        alturaAlbumen,
        diametroAlbumen,
        granja_id:jwtToken.id,
      });

      return response.status(200).send();
    },
    async index(request, response) {
      const { page = 1} = request.query;
      const lote_id = request.body;
      const secaoOvo = request.body;
      const ovos = await connection('ovos').join('granjas','granjas.id','=','lotes.granja_id').where('secaoOvo', secaoOvo).select('*');

      return response.json(ovos);
    },
    async listOvos(request,response){
      const ovos = await connection('ovos').select('*');
      return response.json(ovos);
    },
    async delete(request, response){
      const { id } = request.params;
      const { lote_id, id_gema, id_albumen, id_casca } = request.body;
      const ovos = await connection('ovos').where('id', id).select('lote_id').first();

      if(ovos.lote_id !== lote_id && ovos.id_gema !== id_gema && ovos.id_albumen !== id_albumen && ovos.id_casca !== id_casca){
        return response.status(401).json({ error: 'Impossivel deletar o ovo, verifique se está no lote correto e todas as dependências estão preenchidas'});
      }

      await connection ('ovos').where('id', id).delete();
      await connection ('gemas').where('id', id_gema).delete();
      await connection ('albúmen').where('id', id_albumen).delete();
      await connection ('cascas').where('id', id_casca).delete();
      return response.status(204).send();
    },
    async update(request, response, next){
      const {id}=request.params;
      const data=request.body;
      const sessionId=request.headers.authorization;

      await connection('ovos').update(data).where('id',id).andWhere('secao_id',sessionId);

      response.status(200).send();


      // try{
      //   const { id } = request.params;
      //   const { peso } = request.body;

      //   await connection('ovos').update({ peso }).where('id', id);
      //   return response.send();
      // }catch(error){
      //   next(error);
      // }
    },
    async getEgg(request, response){
      const {id,session}=request.query;

      try{
        const ovo=await connection('ovos').select('*').where('id',id).andWhere('secao_id',session).first();
        
        return response.status(200).json(ovo);
      }catch(error){
        return response.status(400).json({'error':error});
      }
    },
}
