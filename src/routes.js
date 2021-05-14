const express = require('express');
const crypto = require('crypto');
const connection = require('./database/connection');

const GranjaJuridicaController = require('./controllers/GranjaJuridicaController');
const LoteController = require('./controllers/LoteController');
const SessionController = require('./controllers/SessionController');
const AlbúmenController = require('./controllers/AlbúmenController');
const CascaController = require('./controllers/CascaController');
const GemaController = require('./controllers/GemaController');
const OvoController = require('./controllers/OvoController');
const mailerController = require('./controllers/mailerController');
const GranjaFisicaController = require('./controllers/GranjaFisicaController');
const EggSessionController = require('./controllers/EggSessionController');
const DashboardController = require('./controllers/DashboardController');
const ProfileController = require('./controllers/ProfileController');

const routes = express.Router();

routes.post('/login', SessionController.create);
routes.put('/login/updatepassword', SessionController.updatepassword);

routes.post('/cadastro-juridico', GranjaJuridicaController.create);
routes.post('/cadastro-fisico', GranjaFisicaController.create);
routes.get('/listar-granjas-juridicas', GranjaJuridicaController.index);
routes.get('/listar-granjas-fisicas', GranjaFisicaController.index);
routes.post('/confirmar-juridico', GranjaJuridicaController.confirmAccount);
routes.post('/confirmar-fisico', GranjaFisicaController.confirmAccount);

routes.post('/setor-lote', LoteController.create);
routes.get('/perfil-lote', LoteController.index);
routes.get('/perfil-lote/list-lotes', LoteController.listLotes);
routes.get('/perfil-lote/get-lote', LoteController.getLote);
routes.delete('/perfil-lote/:id', LoteController.delete);
routes.put('/perfil-lote/:id', LoteController.update);

routes.post('/albumen', AlbúmenController.create);
routes.delete('/revisar-ovo/albumen/:id', AlbúmenController.delete);
routes.put('/revisar-ovo/albumen/:id', AlbúmenController.update);
routes.get('/lista-albumen', AlbúmenController.index);
routes.post('/casca', CascaController.create);
routes.delete('/revisar-ovo/casca/:id', CascaController.delete);
routes.put('/revisar-ovo/casca/:id', CascaController.update);
routes.get('/lista-cascas', CascaController.index);
routes.post('/gema', GemaController.create);
routes.get('/lista-gemas', GemaController.index);
routes.delete('/revisar-ovo/gema/:id', GemaController.delete);
routes.put('/revisar-ovo/gema/:id', GemaController.update);

routes.post('/ovo', OvoController.create);
routes.get('/ovo', OvoController.getEgg);
routes.get('/perfil-ovos', OvoController.index);
routes.delete('/perfil-ovos/:id', OvoController.delete);
routes.put('/perfil-ovos/:id', OvoController.update);
routes.get('/lista-ovos', OvoController.listOvos);

routes.post('/egg-session', EggSessionController.create);
routes.get('/egg-session', EggSessionController.index);
routes.get('/egg-session/getgranjasessions', EggSessionController.getGranjaSessions);
routes.get('/egg-session/get-eggs', EggSessionController.listEggsBySession);
routes.get('/egg-session/get-session/:sessionId', EggSessionController.getSessionData);

routes.get('/dashboard/statusrow', DashboardController.statusRow);
routes.post('/dashboard/chartdata', DashboardController.chartData);
routes.get('/dashboard/populateselect', DashboardController.populateSelect);

routes.get('/profile/getnome', ProfileController.getNomeGranja);
routes.get('/profile/getgranjadata', ProfileController.getGranjaData);
routes.put('/profile/update/:isGranjaJuridica', ProfileController.updateGranja);

routes.post('/redefinir-senha', mailerController.resetpassword);

module.exports = routes;
