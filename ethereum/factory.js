import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// get CampaignFactory instance
// replace <> with the address of your deployed CampaignFactory instance
const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '<Address of CampaignFactory>',
);

export default instance;