import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import fire from "firebase";
import { RefresherEventDetail } from "@ionic/core";


import "./styles.css";

const Ranking = () => {
  const db = fire.firestore();
  const [rankings, setRankings] = useState<any>();

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    fetchRankings();
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

  const fetchRankings = async () => {
    const rankingData = await db.collection("ranking").orderBy('totalPoints', 'desc').get();
    let allRanking = rankingData.docs.map((doc: any) => {
      return doc.data();
    });

   allRanking.forEach(async(doc: any) => {
      await db
        .collection("teams")
        .where("name", "==", doc.team)
        .get()
        .then((teamData: any) => {
          teamData.forEach((team: any) => {
            doc.logo = team.data().logo;
          });
        });   
      setTimeout(() => setRankings(allRanking), 500);
    });
    
  };
  useEffect(() => {
    fetchRankings();
    //eslint-disable-next-line
  }, []);

  console.log(rankings);

  return (
    <IonPage className="rankings-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Rankigns</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonItemDivider color="">
          <IonAvatar slot="start"></IonAvatar>
          <div className="data-table">
            <div>Win</div> <div>Loss</div> <div>Pro</div> <div>Con</div>{" "}
            <div>Gam</div> <div>Pts</div>
          </div>
        </IonItemDivider>
        {rankings
          ? rankings.map((team: any) => {
              return (
                <IonItem key={Math.random()}>
                  <IonAvatar slot="start">
                    <img src={team.logo} alt={`${team.name}-logo`} />
                  </IonAvatar>
                  <div className="data">
                    <div>{team.wins}</div> <div>{team.loss}</div>{" "}
                    <div>{team.teamPoints}</div> <div>{team.enemyPoints}</div>{" "}
                    <div>{team.games}</div> <div>{team.totalPoints}</div>
                  </div>
                </IonItem>
              );
            })
          : null}
      </IonContent>
    </IonPage>
  );
};

export default Ranking;
