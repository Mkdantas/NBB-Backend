import React, { useEffect, useState } from "react";
import {
  IonAvatar,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import fire from "firebase";

import "./styles.css";
import { addOutline } from "ionicons/icons";
import SkeletonCustom from "../../components/SkeletonCustom";

const Teams: React.FC = () => {
  const db = fire.firestore();

  const [teams, setTeams] = useState<any>();

  const handleDelete = (team: any) => {
    db.collection("teams")
      .doc(team.ID)
      .delete()
      .then(() => {
        console.log("deleted");
      });
  };

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    fetchTeams();
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

  const fetchTeams = async () => {
    const fetchedTeams = await db.collection("teams").get();
    setTeams(
      fetchedTeams.docs.map((doc: any) => {
        return doc.data();
      })
    );
  };

  useEffect(() => {
    fetchTeams();
    //eslint-disable-next-line
  }, []);

  return (
    <IonPage className="teams-page">
      <IonHeader>
        <IonToolbar>
          <IonMenuButton slot="start" />
          <IonTitle>Teams</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerDirection="forward" routerLink="/add-team">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
        {teams ? (
          <IonList>
            {teams.map((team: any) => {
              return (
                <IonItemSliding key={Math.random()}>
                  <IonItemOptions side="end">
                    <IonItemOption
                      color="danger"
                      onClick={(e) => handleDelete(team)}
                      expandable
                    >
                      Delete
                    </IonItemOption>
                  </IonItemOptions>
                  <IonItem key={Math.random()}>
                    <IonAvatar slot="start">
                      <img src={team.logo} alt={`${team.name}-logo`} />
                    </IonAvatar>
                    <IonLabel>{team.name}</IonLabel>
                  </IonItem>
                </IonItemSliding>
              );
            })}
          </IonList>
        ) : (
          <SkeletonCustom />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Teams;
