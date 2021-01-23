import React, { useEffect, useState } from "react";
import {
  IonAvatar,
  IonButton,
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
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import fire from "firebase";

import "./styles.css";
import { addOutline, arrowBack } from "ionicons/icons";
import SkeletonCustom from "../../components/SkeletonCustom";
import UpdateData from "../../components/UpdateData";

const Teams: React.FC = () => {
  const db = fire.firestore();

  const [teams, setTeams] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState('');

  const handleDelete = (team: any) => {
    db.collection("teams")
      .doc(team.ID)
      .delete()
      .then(() => {
        setTeams([]);
        fetchTeams();
      });
  };

  const handleEdit = (team: any) => {
    setEditItem(team.ID);
    setShowModal(true);
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
      <IonModal isOpen={showModal} cssClass='my-custom-class'>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={() => setShowModal(false)}>
            <IonIcon ios={arrowBack} md={arrowBack}/> 
          </IonButton>
          <IonTitle>Update Team</IonTitle>
        </IonToolbar>
      </IonHeader>
        <UpdateData updateID={editItem} type="team"/>
      </IonModal>
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
                  <IonItemOptions side="end" onIonSwipe={e => console.log('foi')}>
                    <IonItemOption
                      color="danger"
                      onClick={(e) => handleDelete(team)}
                      expandable
                      
                    >
                      Delete
                    </IonItemOption>
                  </IonItemOptions>
                  <IonItemOptions side="start" onIonSwipe={e => console.log('foi')}>
                    <IonItemOption
                      onClick={(e) => handleEdit(team)}
                      expandable
                      
                    >
                      Edit
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
