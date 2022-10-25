import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { RoomProvider, useOthers, useMyPresence } from "../liveblocks.config";
import Cursor from "../components/Cursor";
import Home from "../components/index111";
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date'; 
import { getDocumentBySlug, getDocuments } from 'outstatic/server';

export const getStaticProps = async () => {
  const allPostsData = getDocuments('posts', [
    'title',
    'publishedAt',
    'slug',
    'coverImage',
    'description',
    'author'
  ])

  return {
    props: { allPostsData }
  }
}
/**
 * This file shows how to add basic live cursors on your product.
 */

const COLORS = [
  "#E57373",
  "#9575CD",
  "#4FC3F7",
  "#81C784",
  "#FFF176",
  "#FF8A65",
  "#F06292",
  "#7986CB",
];



function Example({ allPostsData }:any) {
  console.log("allPostsData", allPostsData)
  /**
   * useMyPresence returns the presence of the current user and a function to update it.
   * updateMyPresence is different than the setState function returned by the useState hook from React.
   * You don't need to pass the full presence object to update it.
   * See https://liveblocks.io/docs/api-reference/liveblocks-react#useMyPresence for more information
   */
  const [{ cursor }, updateMyPresence] = useMyPresence();

  /**
   * Return all the other users in the room and their presence (a cursor position in this case)
   */
  const others = useOthers();
  //const allPostsData = getSortedPostsData();

  return (

    <main
      className={utilStyles.cover}
      onPointerMove={(event) => {
        event.preventDefault();
        // Update the user cursor position on every pointer move
        updateMyPresence({
          cursor: {
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
          },
        });
      }}
      onPointerLeave={() =>
        // When the pointer goes out, set cursor to null
        updateMyPresence({
          cursor: null,
        })
      }
    >

<Home allPostsData = {allPostsData}  />

      {
        /**
         * Iterate over other users and display a cursor based on their presence
         */
        others.map(({ connectionId, presence }) => {
          if (presence.cursor === null) {
            return null;
          }

          return (
            <Cursor
              key={`cursor-${connectionId}`}
              // connectionId is an integer that is incremented at every new connections
              // Assigning a color with a modulo makes sure that a specific user has the same colors on every clients
              color={COLORS[connectionId % COLORS.length]}
              x={presence.cursor.x}
              y={presence.cursor.y}
            />
          );
        })
      }





    </main>
  );
}

export default function Page({ allPostsData }: any) {
  const roomId = useOverrideRoomId("nextjs-live-cursors");

  return (
    <RoomProvider
      id={roomId}
      /**
       * Initialize the cursor position to null when joining the room
       */
      initialPresence={{
        cursor: null,
      }}
    >
      <Example allPostsData = {allPostsData} />
    </RoomProvider>
  );
}



/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
function useOverrideRoomId(roomId: string) {
  const { query } = useRouter();
  const overrideRoomId = useMemo(() => {
    return query?.roomId ? `${roomId}-${query.roomId}` : roomId;
  }, [query, roomId]);

  return overrideRoomId;
}
