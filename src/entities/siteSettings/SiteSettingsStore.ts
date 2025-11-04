import { getSiteSettings } from "@/actions/server/globals/getSiteSettings"
import { SiteSetting } from "@/payload-types"
import { RequestError } from "@/utils/request"
import { create } from "zustand"

type SiteSettingsState = {
    siteSettings:SiteSetting | null,
    isLoading : boolean,
    error : RequestError | null,
    getSiteSettings : () => Promise<void>,
}
export const useSiteSettings = create<SiteSettingsState>()((set) => ({
    error : null,
    isLoading : true,
    siteSettings : null,
    isReady : false,
    async getSiteSettings(){
        set({isLoading : true})
        const siteSettings = await getSiteSettings();

        if (!siteSettings){
            set({error : {message : "Internal Error", status : 500}, isLoading : false, siteSettings : null})
        }
        else{
            set({siteSettings, error : null, isLoading : false})
        }
    }
}))
