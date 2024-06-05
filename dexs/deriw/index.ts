import { BreakdownAdapter, FetchOptions, SimpleAdapter } from "../../adapters/types";
import { getTimestampAtStartOfDayUTC } from "../../utils/date";
import fetchURL from "../../utils/fetchURL";
import { CHAIN } from "../../helpers/chains";

const basicEndpointV1 = "https://testgmxapi.weequan.cyou/client/analytic/v1/basic";

const v1ChainIDs = {
    [CHAIN.DERIW]: 44474237230
};

const getV2Data = async (endTimestamp: number, chainId: number) => {
    const dayTimestamp = getTimestampAtStartOfDayUTC(endTimestamp)

    const basicInstance = (await fetchURL(`${basicEndpointV1}?endTimestamp=${dayTimestamp}`))
    console.log("basicInstance", basicInstance)


    return {
        totalVolume: `${basicInstance.data.volume_total}`,
        dailyVolume: basicInstance.data.volume_day ? `${basicInstance.data.volume_day}` : '0',
    };
};

const adapter: SimpleAdapter = {
    version: 2,
    adapter: 
    Object.keys(v1ChainIDs).reduce((acc, chain) => {
        return {
            ...acc,
            [chain]: {
                fetch: async ({ startOfDay }: FetchOptions) => await getV2Data(startOfDay, v1ChainIDs[chain]),
                start: 1717297939,
            },
        }
    }, {}),
}

export default adapter;
