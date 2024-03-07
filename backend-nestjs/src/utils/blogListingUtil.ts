import { blogStatus } from 'src/blog-service/blog.dto';
import { versionStatus } from 'src/version/version.dto';

//author

// 1. Draft --- Edit
// 2 - Pending -- No option
// 3 - Reviewed -- Check review and Edit
// 4 -- published_kb -- link if exists, // blog published to knowledge base and has been approved
// 5  published_web - link if exists,
// 6  deleted -- don't show,

//reviewer

// 1. Draft --- Don't show
// 2 - Pending -- Review
// 3 - Reviewed -- no option
// 4 -- published_kb -- link if exists, // blog published to knowledge base
// 5  published_web - link if exists,
// 6  deleted -- don't show,

export const addActionsToData = async (role, data) => {
  if (role === 'USER') {
    return (
      data
        // .filter((item) => item.version_details.length > 0)
        .map((item) => {
          if (item.version_details.length !== 0) {
            const { version_details, ...restData } = item;
            const details = version_details[0];
            const { status, id: version_id, ...restVersionDetails } = details;
            if (status === versionStatus.pending) {
              return {
                ...restData,
                ...restVersionDetails,
                version_id,
                statusMessage: 'Pending for Review',
                actions: [],
              };
            } else if (status === versionStatus.reviewed) {
              return {
                ...restData,
                ...restVersionDetails,
                version_id,
                statusMessage: 'Reviewed',
                actions: ['Edit', 'Suggestions'],
              };
            } else if (status === versionStatus.approved) {
              return {
                ...restData,
                ...restVersionDetails,
                version_id,
                statusMessage: 'Approved',
                actions: ['View in Kb', 'View in Web'],
              };
            }
          } else {
            return {
              ...item,
              actions: ['Edit Draft'],
              statusMessage: 'Edit Draft',
            };
          }
        })
    );
  } else {
    return data.map((item) => {
      const { status, id: version_id, updated_at, ...restData } = item;
      if (status === versionStatus.pending) {
        item = {
          ...restData,
          updated_at,
          version_id,
          statusMessage: 'Pending for Review',
          actions: ['Review'],
        };
      } else if (status === versionStatus.reviewed) {
        item = {
          ...restData,
          updated_at,
          version_id,
          statusMessage: "Waiting for Author's Response",
          actions: ["Suggestions"],
        };
      } else if (status === versionStatus.approved) {
        item = {
          ...restData,
          updated_at,
          version_id,
          statusMessage: 'Approved',
          actions: ['View in Kb', 'View in Web'],
        };
      }
      return item;
    });
  }
};
