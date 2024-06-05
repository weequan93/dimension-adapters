import { BreakdownAdapter, FetchOptions, SimpleAdapter } from "../../adapters/types";
import { getTimestampAtStartOfDayUTC } from "../../utils/date";
import fetchURL from "../../utils/fetchURL";
import { CHAIN } from "../../helpers/chains";

const basicEndpointV1 = "https://testgmxapi.weequan.cyou/client/analytic/v1/basic";

const v1ChainIDs = {
  [CHAIN.DERIW]: 44474237230
};

const getV1Data = async (endTimestamp: number, chainId: number) => {
  
  console.log("endTimestamp", endTimestamp, chainId )
  const dayTimestamp = getTimestampAtStartOfDayUTC(endTimestamp)
  
  console.log("dayTimestamp", dayTimestamp)

  const basicInstance = (await fetchURL(`${basicEndpointV1}?endTimestamp=${dayTimestamp}`))
  console.log("basicInstance", basicInstance)
  if (!basicInstance.data){
    return {
      totalFees: "0",
      dailyFees: "0",
      totalRevenue: "0",
      dailyRevenue: "0"
    }
  }

  return {
    totalFees: `${basicInstance.data.fee_total}`,
    dailyFees: basicInstance.data.fee_day ? `${basicInstance.data.fee_day}` : '0',
    totalRevenue: `${basicInstance.data.revenue_total}`,
    dailyRevenue: basicInstance.data.revenue_day ? `${basicInstance.data.revenue_day}` : '0',
  };
};

const methodology = {
  Fees: "Fees collected from user trading fees, manage fee and liquidation fee",
  Revenue: "Revenue is the profit of the trader",
};

const adapter: SimpleAdapter = {
  version: 2,
  adapter: Object.keys(v1ChainIDs).reduce((acc, chain) => {
    return {
      ...acc,
      [chain]: {
        fetch: async ({ startOfDay }: FetchOptions) => await getV1Data(startOfDay, v1ChainIDs[chain]),
        start: 1717297939,
        meta: {
          methodology,
        },
      },
    }
  }, {}),
}

export default adapter;
