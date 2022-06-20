import React from "react";
import { Meteor } from "meteor/meteor";
import { Button, Form, Header, Table, Modal } from "semantic-ui-react";
import toast from "react-hot-toast";

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
  const [open, setOpen] = React.useState(false);
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
    const newCol: string[] = Object.values(colName).filter((e) => {
      return e != "";
    });
    if (newCol.includes("firstAndLastName")) {
      if (newCol.length > 1) {
        toast.error(
          "If a column contains both the first and last name, only assign said column the value"
        );
        return;
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
        toast.error(
          "Please declare both a column for both the first and last name"
        );
        return;
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
  const handleFileSubmit = () => {
    //stay on page and won't submit if empty
    if (!file) {
      toast.error("Pleade add a CSV file");
      return;
    }
    if (!promoName) {
      toast.error("Pleade add a name to your promo");
      return;
    }
    fileReader.onload = (e: any) => {
      const csvOutput = e.target.result;
      csvFileToArray(csvOutput);
    };
    fileReader.readAsText(file);
    setSubmitedFile(true);
  };
  const handleColSubmit = () => {
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
          console.log(err.message);
        } else {
          //Reset variables
          toast.success(`Promo ${promoName} has been added `);
          setPromoName("");
          setFileInfo([]);
          setColName({
            col1: "",
          });
          setSubmitedFile(false);
          setFile(undefined);
          setPromo(false);
        }
      }
    );
  };

  return (
    <Modal
      closeIcon
      open={open}
      trigger={<Button type="button">Add new promo</Button>}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Modal.Content scrolling>
        <Header icon="archive" content="Import new promo" />
        <Form
          id="csvForm"
          action=""
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Form.Field>
            <input
              type="file"
              id="csvFileInput"
              accept=".csv"
              onChange={handleFileChange}
            />
            <p> Please choose a csv file</p>
          </Form.Field>
          <Form.Field>
            <label>Promo Name</label>
            <input
              type="text"
              id="promoName"
              value={promoName}
              onChange={handlePromoNameChange}
              placeholder="Insert promo name"
            />
          </Form.Field>
          <Button secondary type="button" onClick={handleFileSubmit}>
            Import CSV
          </Button>
        </Form>

        {submitedFile ? (
          <Form
            className="spaceOnY"
            id="promoForm"
            action=""
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Table size="small" striped celled collapsing padded columns="2">
              <Table.Header>
                <Table.Row>
                  {headerKeys.map((key, i = 0) => {
                    i++;
                    return (
                      <>
                        <Table.HeaderCell key={`col${i}`}>
                          <Form.Field inline>
                            <label>{key}</label>
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
                              <option id="empty" key="empty" value=""></option>
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
                          </Form.Field>
                        </Table.HeaderCell>
                      </>
                    );
                  })}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {fileInfo.map((item: {}, i = 0) => {
                  i++;
                  return (
                    <Table.Row key={"student" + i}>
                      {Object.values(item).map((val: any, i = 0) => {
                        i++;
                        return <td key={val + i}>{val}</td>;
                      })}
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
            <Button primary type="button" onClick={handleColSubmit}>
              Submit changes
            </Button>
          </Form>
        ) : (
          <>
            <p>No file submited</p>
          </>
        )}
      </Modal.Content>
    </Modal>
  );
};

export default PromoImport;
