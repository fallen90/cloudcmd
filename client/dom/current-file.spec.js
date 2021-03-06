'use strict';

const test = require('tape');
const diff = require('sinon-called-with-diff');
const sinon = diff(require('sinon'));
const id = (a) => a;
const wraptile = require('wraptile');
const returns = wraptile(id);

const currentFile = require('./current-file');
const {_CURRENT_FILE} = currentFile;

test('current-file: setCurrentName: setAttribute', (t) => {
    const {
        DOM,
        CloudCmd,
    } = global;
    
    global.DOM = getDOM();
    global.CloudCmd = getCloudCmd();
    
    const setAttribute = sinon.stub();
    const current = {
        setAttribute
    };
    
    currentFile.setCurrentName('hello', current);
    
    t.ok(setAttribute.calledWith('data-name', 'js-file-aGVsbG8='), 'should call setAttribute');
    
    global.DOM = DOM;
    global.CloudCmd = CloudCmd;
    
    t.end();
});

test('current-file: setCurrentName: setAttribute: cyrillic', (t) => {
    const {
        DOM,
        CloudCmd,
    } = global;
    
    global.DOM = getDOM();
    global.CloudCmd = getCloudCmd();
    
    const setAttribute = sinon.stub();
    const current = {
        setAttribute
    };
    
    currentFile.setCurrentName('ай', current);
    
    t.ok(setAttribute.calledWith('data-name', 'js-file-JUQwJUIwJUQwJUI5'), 'should call setAttribute');
    
    global.DOM = DOM;
    global.CloudCmd = CloudCmd;
    
    t.end();
});

test('current-file: emit', (t) => {
    const {
        DOM,
        CloudCmd,
    } = global;
    
    const emit = sinon.stub();
    const setAttribute = sinon.stub();
    
    global.DOM = getDOM();
    global.CloudCmd = getCloudCmd({
        emit,
    });
    
    const current = {
        setAttribute,
    };
    
    currentFile.setCurrentName('hello', current);
    
    t.ok(emit.calledWith('current-file', current), 'should call emit');
    
    global.DOM = DOM;
    global.CloudCmd = CloudCmd;
    
    t.end();
});

test('current-file: setCurrentName: return', (t) => {
    const {
        DOM,
        CloudCmd,
    } = global;
    
    const setAttribute = sinon.stub();
    const link = {};
    
    global.DOM = getDOM({
        link
    });
    
    global.CloudCmd = getCloudCmd();
    
    const current = {
        setAttribute,
    };
    
    const result = currentFile.setCurrentName('hello', current);
    
    t.equal(result, link, 'should return link');
    
    global.DOM = DOM;
    global.CloudCmd = CloudCmd;
    
    t.end();
});

test('current-file: getParentDirPath: result', (t) => {
    const {
        DOM,
    } = global;
    
    const getCurrentDirPath = returns('/D/Films/+++favorite films/');
    const getCurrentDirName = returns('+++favorite films');
    
    global.DOM = getDOM({
        getCurrentDirPath,
        getCurrentDirName,
    });
    
    const result = currentFile.getParentDirPath();
    const expected = '/D/Films/';
    
    global.DOM = DOM;
    
    t.equal(result, expected, 'should return parent dir path');
    t.end();
});

test('current-file: isCurrentFile: no', (t) => {
    const {
        DOM,
        CloudCmd,
    } = global;
    
    global.DOM = getDOM();
    global.CloudCmd = getCloudCmd();
    
    const result = currentFile.isCurrentFile();
    const expect = false;
    
    global.DOM = DOM;
    global.CloudCmd = CloudCmd;
    
    t.equal(result, expect, 'should equal');
    t.end();
});

test('current-file: isCurrentFile', (t) => {
    const {
        DOM,
        CloudCmd,
    } = global;
    
    const isContainClass = sinon.stub();
    
    global.DOM = getDOM({
        isContainClass
    });
    
    global.CloudCmd = getCloudCmd();
    
    const current = {};
    currentFile.isCurrentFile(current);
    
    global.DOM = DOM;
    global.CloudCmd = CloudCmd;
    
    t.ok(isContainClass.calledWith(current, _CURRENT_FILE), 'should call isContainClass');
    t.end();
});

function getCloudCmd({emit} = {}) {
    return {
        prefix: '',
        emit: emit || sinon.stub(),
    };
}

function getDOM({
    link = {},
    getCurrentDirPath = sinon.stub(),
    getCurrentDirName = sinon.stub(),
    getByDataName = sinon.stub(),
    isContainClass = sinon.stub(),
} = {}) {
    return {
        getCurrentDirPath,
        getCurrentDirName,
        getByDataName,
        isContainClass,
        CurrentInfo: {
            link,
            dirPath: '/',
        }
    };
}

