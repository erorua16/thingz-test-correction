import React from "react";
import { Meteor } from "meteor/meteor";
import Modal from "./Modal";
type StudentsType = [{ firstName: ""; lastName: "" }];
type colNameType = {
  col1: "";
  col2?: "";
};

//@TODO
//Manage to do only one handle change and one set state
//Add first and last name in same col

const PromoImport = (): React.ReactElement => {
  /////SET VARIABLES/////
  const [promoName, setPromoName] = React.useState<string>("");
  const [file, setFile] = React.useState<File>();
  const [fileInfo, setFileInfo] = React.useState<any>([]);
  const [colName, setColName] = React.useState<colNameType>({
    col1: "",
  });
  const [promo, setPromo] = React.useState<boolean>(false);
  const [submitedFile, setSubmitedFile] = React.useState<boolean>(false);
  const fileReader: FileReader = new FileReader();
  const headerKeys: string[] = Object.keys(Object.assign({}, ...fileInfo));

  React.useEffect(() => {
    if (promo) {
      if (!promoName) return;
      //Insert into db
      addPromo();
    }
  }, [fileInfo, promo]);

  /////CSV CONVERSION/////
  const csvFileToArray = (file: any) => {
    const csvHeader = file.slice(0, file.indexOf("\n")).split(",");
    if (csvHeader[0] == "") (csvHeader[0] = "col1"), (csvHeader[1] = "col2");
    const csvRows = file.slice(file.indexOf("\n") + 1).split("\n");
    const array: StudentsType = csvRows.map((i: any) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object: any, header: any, index: any) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });
    setFileInfo(array);
  };

  /////RENAME COLS///////
  const renameKeys = (): void => {
    //set newheader
    const newCol: string[] = Object.values(colName);

    if (newCol.includes("firstAndLastName")) {
      if (newCol.length > 1) {
        return alert(
          "If a column contains both the first and last name, only assign said column the value"
        );
      }
      //set new data
      setNewColName(newCol);
      setPromo(true);
    } else {
      //if header doesn't have firstName and lastName then don't validate
      if (newCol.includes("firstName") && newCol.includes("lastName")) {
        //set new data
        setNewColName(newCol);
        setPromo(true);
      } else {
        alert("Please declare both a column for both the first and last name");
      }
    }
  };
  /////setFileInfo for new Col///////
  const setNewColName = (newCol: any) => {
    setFileInfo(
      fileInfo.map((foo: any) => {
        const newobj = newCol.reduce((object: any, header: any, index: any) => {
          object[header] = Object.values(foo)[index];
          return object;
        }, {});
        return newobj;
      })
    );
  };

  /////HANDLE CHANGE/////
  const handlePromoNameChange = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    //Get user input
    setPromoName(e.currentTarget.value);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: any = e.target.files;
    if (!e) return;
    setFile(files[0]);
  };
  const handleColSelect = (e: any) => {
    const value = e.target.value;
    setColName({
      ...colName,
      [e.target.id]: value,
    });
  };

  /////HANDLE SUBMIT/////
  const handleFileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //stay on page and won't submit if empty
    e.preventDefault();
    if (!file) return;
    if (!promoName) return;
    fileReader.onload = (e: any) => {
      const csvOutput = e.target.result;
      csvFileToArray(csvOutput);
    };
    await fileReader.readAsText(file);
    await setSubmitedFile(true);
  };
  const handleColSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //stay on page and won't submit if empty
    e.preventDefault();
    if (!fileInfo) return;
    //Rename the cols
    renameKeys();
  };

  ///////ADD TO DB///////
  const addPromo = () => {
    Meteor.call(
      "insertPromo",
      {
        name: promoName,
        students: fileInfo,
        createdAt: new Date(),
      },
      (err: any) => {
        if (err) {
          alert(err.message);
        } else {
          //Reset variables
          setPromoName("");
          setFileInfo([]);
          setColName({
            col1: "",
          });
          setSubmitedFile(false);
          setFile(undefined);
          setPromo(false);
          alert("success!");
        }
      }
    );
  };

  return (
    <>
      <Modal
        borderColor=""
        button={
          <button className="bg-blue-500 md:h-full md:w-full hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline" type="button">
            Add new promo
          </button>
        }
        element={
          <>
            <form action="" onSubmit={handleFileSubmit}>
              <input
                type="file"
                id="csvFileInput"
                accept=".csv"
                onChange={handleFileChange}
              />
              <input
                className="my-8 md:mr-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="promoName"
                value={promoName}
                onChange={handlePromoNameChange}
                placeholder="Insert promo name"
              />
              <button
                type="submit"
                className="bg-blue-500 md:h-[30%] md:w-[30%] hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
              >
                Import CSV
              </button>
            </form>

            {submitedFile ? (
              <form action="" onSubmit={handleColSubmit}>
                <table>
                  <thead>
                    <tr>
                      {headerKeys.map((key, i = 0) => {
                        i++;
                        return (
                          <>
                            <th key={`col${i}`}>
                              <p>{key}</p>
                              <select
                                onChange={handleColSelect}
                                id={`col${i}`}
                                key={`col${i}`}
                                defaultValue="default"
                              >
                                <option
                                  hidden
                                  disabled
                                  id="default"
                                  key="default"
                                  value="default"
                                >
                                  select an option
                                </option>
                                <option
                                  key="firstName"
                                  value="firstName"
                                  id="firstName"
                                >
                                  First Name
                                </option>
                                <option
                                  key="lastName"
                                  id="lastName"
                                  value="lastName"
                                >
                                  Last Name
                                </option>
                                <option
                                  key="firstAndLastName"
                                  value="firstAndLastName"
                                  id="firstAndLastName"
                                >
                                  First Name And Last Name
                                </option>
                              </select>
                            </th>
                          </>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {fileInfo.map((item: {}, i = 0) => {
                      i++;
                      return (
                        <tr key={"student" + i}>
                          {Object.values(item).map((val: any, i = 0) => {
                            i++;
                            return <td key={val + i}>{val}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <button
                  className="bg-blue-500 md:h-[30%] md:w-[30%] hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Submit changes
                </button>
              </form>
            ) : (
              <>
                <p>No file submited</p>
              </>
            )}
          </>
        }
      />
    </>
  );
};

export default PromoImport;
