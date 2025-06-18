
export interface SpaceXLaunch {
  id: string;
  name: string;
  date_utc: string;
  rocket: {
    name: string;
  };
  launchpad: {
    name: string;
    locality: string;
    region: string;
  };
  details?: string;
  links: {
    webcast?: string;
    article?: string;
    wikipedia?: string;
  };
  success?: boolean;
  upcoming: boolean;
}
