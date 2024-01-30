import React, { useState } from "react";
import { Link } from "react-router-dom";

import messageImg from "./message.png";
import homeStyles from "./styles.module.css";

function IndividualPR(props) {
  const {
    id, 
    number,
    title,
    state,
    updated_at,
    labels,
    html_url,
    merged_at,
    messageCount,
    user,
    draft,
  } = props;

  const [mouseHover, setMouseHover] = useState(false);
  const [mouseHoverCollab, setMouseHoverCollab] = useState();

  const colorCodes = {
    merged: getComputedStyle(document.documentElement).getPropertyValue('--color-status-merged'),
    closed: getComputedStyle(document.documentElement).getPropertyValue('--color-status-closed'),
    open: getComputedStyle(document.documentElement).getPropertyValue('--color-status-open'),
    draft: getComputedStyle(document.documentElement).getPropertyValue('--color-status-draft'),
  };

  const getUpdatedTime = (date) => {
    const dateObj = new Date(date);
    let hour = dateObj.getHours();
    let minutes = dateObj.getMinutes();

    let day = dateObj.getDate(); 
    let month = dateObj.getMonth() + 1;

    if (hour < 10 && hour > 0) hour = "0"+hour;
    if (minutes < 10 && minutes > 0) minutes = "0"+minutes;
    if (day < 10 && day > 0) day = "0"+day;
    if (month < 10 && month > 0) month = "0"+month;

    return `${day}-${month}-${dateObj.getFullYear()}  ${hour}:${minutes}`
  }

  return (
    <div
      key={id}
      id={id}
      className={homeStyles.individual_pull_request}
      style={{
        backgroundColor: `${colorCodes[draft ? 'draft' : merged_at ? 'merged' : state]}10`,
        borderColor: `${colorCodes[draft ? 'draft' : merged_at ? 'merged' : state]}`,
      }}
    >
      <div className={homeStyles.pr_title_container}>
        <div className={homeStyles.pr_title_section}>
          <div style={{ marginRight: "10px", marginBottom: "10px" }}>
            <Link to={html_url} className={homeStyles.pr_title} target="_blank">
              {title}
            </Link>
          </div>
          <div>
            <div className={homeStyles.pr_labels_container}>
              {labels.length > 0 &&
                labels.map(label => (
                  <div className={homeStyles.pr_label_tags_container}>
                    <span
                      className={homeStyles.pr_label_tags_title}
                      style={{
                        backgroundColor: `#${label.color}30`,
                        borderColor: `#${label.color}`,
                        color: `#${label.color}`,
                      }}
                      onMouseEnter={() => { setMouseHover(label.id) }}
                      onMouseLeave={() => { setMouseHover() }}
                    >
                      {label.name}
                    </span>
                    {label.description && mouseHover === label.id && 
                      <div className={homeStyles.pr_label_tags_tooltip}>
                        <span>{label.description}</span>
                      </div>
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        {messageCount[number] > 0 && 
          <div className={homeStyles.pr_message_icon}>
            <span>
              <img src={messageImg} height={18} width={18} alt="Message" className={homeStyles.pr_message_img} />
            </span>
            <span className={homeStyles.pr_message_count}>
              {messageCount[number]}
            </span>
          </div>
        }
      </div>
      <div className={homeStyles.pr_footer}>
        <label className={homeStyles.pr_id}>
          #{number} by{" "}
          <Link 
            to={user.html_url} 
            className={homeStyles.pr_user_name} 
            onMouseEnter={() => setMouseHoverCollab(user.id)} 
            onMouseLeave={() => setMouseHoverCollab()}
          >
            {user.login}
          </Link>
          {mouseHoverCollab === user.id && <div className={homeStyles.pr_label_tags_tooltip}>
            <img
              className={homeStyles.avatar_url}
              src={user.avatar_url}
              height={60}
              width={60}
              alt={user.login}
            />
            <span className={homeStyles.pr_collaborator}>{user.login}</span>
          </div>}
        </label>
        <label className={homeStyles.pr_id}>{"Last Updated: "}{getUpdatedTime(updated_at)}</label>
      </div>
    </div>
  );
}

export default IndividualPR;
