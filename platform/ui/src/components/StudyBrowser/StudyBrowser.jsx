import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { ButtonGroup, Button, StudyItem, ThumbnailList } from '@ohif/ui';

const buttonClasses = 'text-white text-base border-none bg-black p-2 min-w-18';
const activeButtonClasses = 'bg-primary-main';

const getTrackedSeries = displaySets => {
  let trackedSeries = 0;
  displaySets.forEach(displaySet => {
    if (displaySet.isTracked) {
      trackedSeries++;
    }
  });

  return trackedSeries;
};

const StudyBrowser = ({
  tabs,
  activeTabName,
  expandedStudyInstanceUIDs,
  onClickTab,
  onClickStudy,
  onClickThumbnail,
}) => {
  const [thumbnailActive, setThumbnailActive] = useState(null);

  const getTabContent = () => {
    const tabData = tabs.find(tab => tab.name === activeTabName);

    return tabData.studies.map(
      ({
        studyInstanceUid,
        date,
        description,
        numInstances,
        modalities,
        displaySets,
      }) => {
        const isExpanded = expandedStudyInstanceUIDs.includes(studyInstanceUid);
        return (
          <React.Fragment key={studyInstanceUid}>
            <StudyItem
              date={date}
              description={description}
              numInstances={numInstances}
              modalities={modalities}
              trackedSeries={getTrackedSeries(displaySets)}
              isActive={isExpanded}
              onClick={() => {
                onClickStudy(studyInstanceUid);
              }}
            />
            {isExpanded && displaySets && (
              <ThumbnailList
                thumbnails={displaySets}
                thumbnailActive={thumbnailActive}
                onThumbnailClick={thumbnailId => {
                  setThumbnailActive(
                    thumbnailId === thumbnailActive ? null : thumbnailId
                  );

                  if (onClickThumbnail) {
                    // TODO: what is thumbnailId? Should pass display set instead
                    onClickThumbnail(thumbnailId);
                  }
                }}
              />
            )}
          </React.Fragment>
        );
      }
    );
  };

  return (
    <React.Fragment>
      <div className="flex flex-row items-center justify-center h-16 p-4 border-b w-100 border-secondary-light bg-primary-dark">
        <ButtonGroup
          variant="outlined"
          color="inherit"
          className="border rounded-md border-secondary-light"
        >
          {tabs.map(tab => {
            const { name, label } = tab;
            const isActive = activeTabName === name;
            return (
              <Button
                key={name}
                className={classnames(
                  buttonClasses,
                  isActive && activeButtonClasses
                )}
                size="initial"
                onClick={() => {
                  onClickTab(name);
                }}
              >
                {label}
              </Button>
            );
          })}
        </ButtonGroup>
      </div>
      <div className="flex flex-col flex-1 overflow-auto invisible-scrollbar">
        {getTabContent()}
      </div>
    </React.Fragment>
  );
};

StudyBrowser.propTypes = {
  onClickTab: PropTypes.func.isRequired,
  onClickStudy: PropTypes.func,
  onClickThumbnail: PropTypes.func,
  activeTabName: PropTypes.string.isRequired,
  expandedStudyInstanceUIDs: PropTypes.arrayOf(PropTypes.string).isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      studies: PropTypes.arrayOf(
        PropTypes.shape({
          studyInstanceUid: PropTypes.string.isRequired,
          date: PropTypes.string,
          numInstances: PropTypes.number,
          modalities: PropTypes.string,
          description: PropTypes.string,
          displaySets: PropTypes.arrayOf(
            PropTypes.shape({
              displaySetInstanceUID: PropTypes.string.isRequired,
              imageSrc: PropTypes.string,
              imageAltText: PropTypes.string,
              seriesDate: PropTypes.string,
              seriesNumber: PropTypes.number,
              numInstances: PropTypes.number,
              description: PropTypes.string,
              componentType: PropTypes.oneOf([
                'thumbnail',
                'thumbnailTracked',
                'thumbnailNoImage',
              ]).isRequired,
              isTracked: PropTypes.bool,
              viewportIdentificator: PropTypes.string,
              /**
               * Data the thumbnail should expose to a receiving drop target. Use a matching
               * `dragData.type` to identify which targets can receive this draggable item.
               * If this is not set, drag-n-drop will be disabled for this thumbnail.
               *
               * Ref: https://react-dnd.github.io/react-dnd/docs/api/use-drag#specification-object-members
               */
              dragData: PropTypes.shape({
                /** Must match the "type" a dropTarget expects */
                type: PropTypes.string.isRequired,
              }),
            })
          ),
        })
      ).isRequired,
    })
  ),
};

export default StudyBrowser;
