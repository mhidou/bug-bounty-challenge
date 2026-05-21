import { makeAutoObservable, runInAction } from "mobx";
import {
  ActionError,
  ActionResultStatus,
  ActionSuccess
} from "../../../types/global";
import { resultOrError } from "../../../utils/global";

export interface User {
  firstName?: string;
  lastName?: string;
  eMail?: string;
}

const fetchOwnUser = (): Promise<User> =>
  // Simulated API call; replace with real fetch when wiring an actual backend.
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          firstName: "Aria",
          lastName: "Test",
          eMail: "linda.bolt@osapiens.com"
        }),
      500
    )
  );

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getOwnUser(): Promise<ActionSuccess<User> | ActionError> {
    const [result, error] = await resultOrError(fetchOwnUser());

    if (error) {
      return { status: ActionResultStatus.ERROR, error };
    }

    if (result) {
      runInAction(() => {
        this.user = result;
      });
      return { status: ActionResultStatus.SUCCESS, result };
    }

    return {
      status: ActionResultStatus.ERROR,
      error: new Error("Something went wrong.")
    };
  }
}
